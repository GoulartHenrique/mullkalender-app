import axios from "axios";
import * as cheerio from "cheerio";

const SWE_BASE_URL = "https://abfallkalender.stadtwerke-erfurt.de";

export interface HouseNumberOption {
  hnrId: number;
  label: string; // e.g. "10", "6-8", "58b,58c-59"
}

export interface CollectionDay {
  day: number; // e.g. 23
  weekday: string; // e.g. "Di"
  month: string; // e.g. "Juni 2026"
  weekNumber: string; // e.g. "KW 26"
  binTypes: string[]; // e.g. ["Bio", "Papier"]
}

// Maps the icon filename used by SWE to a human-readable waste type name.
// Used as a fallback in case the title/alt attribute is missing.
const ICON_NAME_MAP: Record<string, string> = {
  Icon_Bio: "Bio",
  Icon_Papier: "Papier",
  Icon_gelbersack: "Gelber Sack",
  Icon_Hausmuell: "Restmüll",
};

function resolveBinType($img: cheerio.Cheerio<any>): string {
  const title = $img.attr("title");
  if (title) return title;

  const src = $img.attr("src") || "";
  const match = Object.keys(ICON_NAME_MAP).find((key) => src.includes(key));
  return match ? ICON_NAME_MAP[match] : "Unbekannt";
}

/**
 * Fetches the list of valid house numbers for a given street.
 * Mirrors the search_hnr.php call used by the original SWE mobile site.
 */
export async function fetchHouseNumbers(
  strId: number,
  streetName: string
): Promise<HouseNumberOption[]> {
  const response = await axios.post(
    `${SWE_BASE_URL}/search/search_hnr.php`,
    new URLSearchParams({
      str_id: String(strId),
      input_str: streetName,
      input_hnr: "",
      hidden_kalenderart: "privat",
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const $ = cheerio.load(response.data);
  const houseNumbers: HouseNumberOption[] = [];

  $("li[id^='hnr_']").each((_, el) => {
    const idAttr = $(el).attr("id"); // e.g. "hnr_2641112"
    const hnrId = idAttr ? parseInt(idAttr.replace("hnr_", ""), 10) : NaN;
    const label = $(el).find("span").last().text().trim();

    if (!isNaN(hnrId) && label) {
      houseNumbers.push({ hnrId, label });
    }
  });

  return houseNumbers;
}

/**
 * Fetches and parses the actual waste collection calendar for a given
 * street + house number combination. Mirrors the getNextCalendarWeeks.php
 * call used by the original SWE mobile site.
 *
 * Note: the upstream endpoint paginates by weeks using a "stamp" (unix
 * timestamp) parameter. Passing the current timestamp returns the
 * upcoming weeks from "now".
 */
export async function fetchCollectionCalendar(
  strId: number,
  hnrId: number
): Promise<CollectionDay[]> {
  const stamp = Math.floor(Date.now() / 1000);

  const response = await axios.get(
    `${SWE_BASE_URL}/mobile/getNextCalendarWeeks.php`,
    {
      params: {
        hidden_id_str: strId,
        hidden_id_zusatz: hnrId,
        stamp,
        hidden_kalenderart: "privat",
      },
    }
  );

  // The endpoint returns JSON with an escaped HTML fragment inside `html`
  const html: string = response.data?.html ?? "";
  const $ = cheerio.load(html);

  const days: CollectionDay[] = [];

  $("div.kw").each((_, weekEl) => {
    const month = $(weekEl).find(".weekHeader .month p").first().text().trim();
    const weekNumber = $(weekEl)
      .find(".weekHeader .weekNumber p")
      .first()
      .text()
      .trim();

    $(weekEl)
      .find("table tr.day")
      .each((_, dayEl) => {
        const dayNumber = parseInt(
          $(dayEl).find(".dayNumber p").first().text().trim(),
          10
        );

        // dayName contains the abbreviation (e.g. "Mo") followed by a
        // visually-hidden span with the rest of the word (e.g. "ntag").
        // We only want the visible abbreviation here.
        const weekday = $(dayEl)
          .find(".dayName p")
          .clone()
          .children("span")
          .remove()
          .end()
          .text()
          .trim();

        const binTypes: string[] = [];
        $(dayEl)
          .find(".dayBins img")
          .each((_, imgEl) => {
            binTypes.push(resolveBinType($(imgEl)));
          });

        if (!isNaN(dayNumber) && binTypes.length > 0) {
          days.push({ day: dayNumber, weekday, month, weekNumber, binTypes });
        }
      });
  });

  return days;
}