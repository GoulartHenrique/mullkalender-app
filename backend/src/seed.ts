import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import WasteItem from "./models/WasteItem";
import User from "./models/User";

dotenv.config();

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
    await WasteItem.deleteMany({});
    await User.deleteMany({});
    console.log("Collections cleared");

    // Insert data
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