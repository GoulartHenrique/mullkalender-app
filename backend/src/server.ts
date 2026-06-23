import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db";
import wasteItemRoutes from "./routes/wasteItem.routes";
import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import userRoutes from "./routes/user.routes";
import sweScheduleRoutes from "./routes/sweSchedule.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mullkalender-frontend.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/waste-items", wasteItemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
app.use("/api", sweScheduleRoutes);


app.get("/", (_req, res) => {
  res.json({ message: "Müllkalender API running" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});