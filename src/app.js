import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import matakuliahRoutes from "./routes/matakuliahRoutes.js";
import profilRoutes from "./routes/profilRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "NilaiKu API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/matakuliah", matakuliahRoutes);
app.use("/api/profil", profilRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

export default app;