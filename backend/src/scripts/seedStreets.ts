import axios from "axios";
import mongoose from "mongoose";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import Street from "../models/street.model";
import { fetchHouseNumbers } from "../services/swe.service";

dotenv.config();

const SWE_BASE_URL = "https://abfallkalender.stadtwerke-erfurt.de";

// Small delay between requests so we don't hammer the SWE server while
// fetching house numbers for ~700 streets in sequence.
const DELAY_MS = 250;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// The search_strassen.php endpoint returns the FULL static street list
// regardless of the query sent — filtering happens client-side in the
// original site's JS. We exploit that here to grab everything in one call.
async function fetchAllStreets(): Promise<{ name: string; strId: number }[]> {
  const response = await axios.post(
    `${SWE_BASE_URL}/search/search_strassen.php`,
    "input_str=",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const $ = cheerio.load(response.data);
  const streets: { name: string; strId: number }[] = [];

  $("li[id^='str_']").each((_, el) => {
    const idAttr = $(el).attr("id"); // e.g. "str_173558"
    const strId = idAttr ? parseInt(idAttr.replace("str_", ""), 10) : NaN;
    const name = $(el).find("span").last().text().trim();

    if (!isNaN(strId) && name) {
      streets.push({ name, strId });
    }
  });

  return streets;
}

async function seedStreets() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);

  console.log("Fetching street list from SWE Erfurt...");
  const streets = await fetchAllStreets();
  console.log(`Fetched ${streets.length} streets. Now fetching house numbers for each...`);

  if (streets.length === 0) {
    console.warn("No streets were parsed. Aborting seed to avoid wiping existing data.");
    await mongoose.disconnect();
    return;
  }

  const streetsWithHouseNumbers = [];

  for (let i = 0; i < streets.length; i++) {
    const street = streets[i];
    try {
      const houseNumbers = await fetchHouseNumbers(street.strId, street.name);
      streetsWithHouseNumbers.push({ ...street, houseNumbers });
      console.log(
        `[${i + 1}/${streets.length}] ${street.name} -> ${houseNumbers.length} house numbers`
      );
    } catch (err) {
      console.error(`Failed to fetch house numbers for "${street.name}":`, err);
      // Still save the street, just without house numbers, rather than
      // losing the whole street because one request failed.
      streetsWithHouseNumbers.push({ ...street, houseNumbers: [] });
    }

    await sleep(DELAY_MS);
  }

  console.log("Clearing existing Street collection...");
  await Street.deleteMany({});

  console.log("Inserting streets with house numbers...");
  await Street.insertMany(streetsWithHouseNumbers, { ordered: false });

  console.log(`Done. Seeded ${streetsWithHouseNumbers.length} streets.`);
  await mongoose.disconnect();
}

seedStreets().catch((err) => {
  console.error("Failed to seed streets:", err);
  process.exit(1);
});