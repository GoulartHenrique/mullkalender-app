import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Müllkalender API running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
