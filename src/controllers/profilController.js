import bcrypt from "bcryptjs";
import db from "../config/database.js";

export const getProfil = (req, res) => {
  try {
    const user = db
      .query("SELECT id, username, nama, created_at FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { nama, password } = req.body;

    const user = db
      .query("SELECT * FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const newNama = nama || user.nama;
    let newPassword = user.password;

    if (password) {
      newPassword = await bcrypt.hash(password, 10);
    }

    db.run(
      "UPDATE users SET nama = ?, password = ? WHERE id = ?",
      [newNama, newPassword, req.user.id]
    );

    return res.status(200).json({ message: "Profil berhasil diupdate" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};  