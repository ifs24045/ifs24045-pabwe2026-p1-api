import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

export const register = async (req, res) => {
  try {
    const { username, password, nama } = req.body;

    if (!username || !password || !nama) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const existingUser = db.query("SELECT * FROM users WHERE username = ?").get(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (username, password, nama) VALUES (?, ?, ?)", [
      username,
      hashedPassword,
      nama,
    ]);

    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password harus diisi" });
    }

    const user = db.query("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: { id: user.id, username: user.username, nama: user.nama },
    });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};