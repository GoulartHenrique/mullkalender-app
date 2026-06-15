import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Schedule from "./models/Schedule";
import WasteItem from "./models/WasteItem";
import User from "./models/User";

dotenv.config();

const schedules = [
  {
    street: "Anger",
    houseNumber: "1",
    district: "Altstadt",
    city: "Erfurt",
    schedule: [
      { type: "Biotonne", color: "#4ade80", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
      { type: "Gelber Sack", color: "#facc15", dates: ["2026-06-19", "2026-07-03", "2026-07-17"], frequency: "biweekly" },
      { type: "Papiertonne", color: "#60a5fa", dates: ["2026-06-29", "2026-07-27"], frequency: "monthly" },
      { type: "Restmüll", color: "#6b7280", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
    ],
  },
  {
    street: "Juri-Gagarin-Ring",
    houseNumber: "1",
    district: "Mitte",
    city: "Erfurt",
    schedule: [
      { type: "Biotonne", color: "#4ade80", dates: ["2026-06-23", "2026-07-07", "2026-07-21"], frequency: "biweekly" },
      { type: "Gelber Sack", color: "#facc15", dates: ["2026-06-25", "2026-07-09", "2026-07-23"], frequency: "biweekly" },
      { type: "Papiertonne", color: "#60a5fa", dates: ["2026-06-30", "2026-07-28"], frequency: "monthly" },
      { type: "Restmüll", color: "#6b7280", dates: ["2026-06-23", "2026-07-07", "2026-07-21"], frequency: "biweekly" },
    ],
  },
  {
    street: "Krämerbrücke",
    houseNumber: "1",
    district: "Altstadt",
    city: "Erfurt",
    schedule: [
      { type: "Biotonne", color: "#4ade80", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
      { type: "Gelber Sack", color: "#facc15", dates: ["2026-06-19", "2026-07-03", "2026-07-17"], frequency: "biweekly" },
      { type: "Papiertonne", color: "#60a5fa", dates: ["2026-06-29", "2026-07-27"], frequency: "monthly" },
      { type: "Restmüll", color: "#6b7280", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
    ],
  },
  {
    street: "Bahnhofstraße",
    houseNumber: "1",
    district: "Mitte",
    city: "Erfurt",
    schedule: [
      { type: "Biotonne", color: "#4ade80", dates: ["2026-06-24", "2026-07-08", "2026-07-22"], frequency: "biweekly" },
      { type: "Gelber Sack", color: "#facc15", dates: ["2026-06-27", "2026-07-11", "2026-07-25"], frequency: "biweekly" },
      { type: "Papiertonne", color: "#60a5fa", dates: ["2026-07-01", "2026-07-29"], frequency: "monthly" },
      { type: "Restmüll", color: "#6b7280", dates: ["2026-06-24", "2026-07-08", "2026-07-22"], frequency: "biweekly" },
    ],
  },
  {
    street: "Schlösserstraße",
    houseNumber: "1",
    district: "Altstadt",
    city: "Erfurt",
    schedule: [
      { type: "Biotonne", color: "#4ade80", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
      { type: "Gelber Sack", color: "#facc15", dates: ["2026-06-19", "2026-07-03", "2026-07-17"], frequency: "biweekly" },
      { type: "Papiertonne", color: "#60a5fa", dates: ["2026-06-29", "2026-07-27"], frequency: "monthly" },
      { type: "Restmüll", color: "#6b7280", dates: ["2026-06-22", "2026-07-06", "2026-07-20"], frequency: "biweekly" },
    ],
  },
];

const wasteItems = [
  { name: "Batterie", aliases: ["Akku", "battery"], category: "Sondermüll", bin: null, instruction: "Abgabe im Supermarkt oder Wertstoffhof. Nicht in den Hausmüll!", dropOffPoints: ["REWE", "Kaufland", "Wertstoffhof Erfurt"], icon: "🔋" },
  { name: "Pizzakarton", aliases: ["Karton", "pizza box"], category: "Papiertonne", bin: "Papiertonne", instruction: "Nur wenn nicht fettig. Fettige Teile in den Restmüll.", icon: "📦" },
  { name: "Glasflasche", aliases: ["Flasche", "Glas", "glass bottle"], category: "Restmüll", bin: null, instruction: "In den Glascontainer — getrennt nach Farbe: weiß, braun, grün.", dropOffPoints: ["Glascontainer"], icon: "🍾" },
  { name: "Joghurtbecher", aliases: ["Becher", "Plastikbecher", "yogurt cup"], category: "Gelber Sack", bin: "Gelber Sack", instruction: "Kurz ausspülen und in den Gelben Sack.", icon: "🥛" },
  { name: "Zeitschrift", aliases: ["Magazin", "Zeitung", "magazine"], category: "Papiertonne", bin: "Papiertonne", instruction: "In die Papiertonne.", icon: "📰" },
  { name: "Medikamente", aliases: ["Tabletten", "Pillen", "medicine"], category: "Sondermüll", bin: null, instruction: "Zur Apotheke bringen — nicht in den Hausmüll!", dropOffPoints: ["Apotheke"], icon: "💊" },
  { name: "Elektrogeräte", aliases: ["Fernseher", "Computer", "electronics"], category: "Sondermüll", bin: null, instruction: "Zum Wertstoffhof oder Elektrofachhändler bringen.", dropOffPoints: ["Wertstoffhof Erfurt", "MediaMarkt"], icon: "💻" },
  { name: "Bananenschale", aliases: ["Obst", "Gemüse", "banana peel"], category: "Biotonne", bin: "Biotonne", instruction: "In die Biotonne.", icon: "🍌" },
  { name: "Plastikflasche", aliases: ["PET-Flasche", "plastic bottle"], category: "Gelber Sack", bin: "Gelber Sack", instruction: "Wenn kein Pfand drauf ist, in den Gelben Sack.", icon: "🧴" },
  { name: "Glühbirne", aliases: ["Lampe", "light bulb"], category: "Sondermüll", bin: null, instruction: "Zum Wertstoffhof bringen.", dropOffPoints: ["Wertstoffhof Erfurt"], icon: "💡" },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined");

    await mongoose.connect(uri);
    console.log("MongoDB connected");

    // Clear collections before inserting
    await Schedule.deleteMany({});
    await WasteItem.deleteMany({});
    await User.deleteMany({});
    console.log("Collections cleared");

    // Insert data
    await Schedule.insertMany(schedules);
    console.log(`${schedules.length} schedules inserted`);

    await WasteItem.insertMany(wasteItems);
    console.log(`${wasteItems.length} waste items inserted`);

    // Create test user
    const passwordHash = await bcrypt.hash("test123", 10);
    await User.create({
      email: "test@mullkalender.de",
      passwordHash,
      address: { street: "Anger", houseNumber: "1", city: "Erfurt" },
      language: "de",
    });
    console.log("Test user created");

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();