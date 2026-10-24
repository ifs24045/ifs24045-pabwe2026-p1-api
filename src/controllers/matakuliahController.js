import db from "../config/database.js";

const nilaiToAngka = (nilai) => {
  const konversi = { A: 4, B: 3, C: 2, D: 1, E: 0 };
  return konversi[nilai] ?? null;
};

export const getMatakuliah = (req, res) => {
  try {
    const { semester } = req.query;
    let matakuliah;

    if (semester) {
      matakuliah = db
        .query("SELECT * FROM matakuliah WHERE user_id = ? AND semester = ? ORDER BY created_at DESC")
        .all(req.user.id, semester);
    } else {
      matakuliah = db
        .query("SELECT * FROM matakuliah WHERE user_id = ? ORDER BY semester ASC")
        .all(req.user.id);
    }

    return res.status(200).json({ data: matakuliah });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const tambahMatakuliah = (req, res) => {
  try {
    const { nama, kode, sks, nilai, semester } = req.body;

    if (!nama || !kode || !sks || !semester) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    db.run(
      "INSERT INTO matakuliah (user_id, nama, kode, sks, nilai, semester) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.id, nama, kode, sks, nilai || null, semester]
    );

    return res.status(201).json({ message: "Mata kuliah berhasil ditambahkan" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateMatakuliah = (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kode, sks, nilai, semester } = req.body;

    const mk = db
      .query("SELECT * FROM matakuliah WHERE id = ? AND user_id = ?")
      .get(id, req.user.id);

    if (!mk) {
      return res.status(404).json({ message: "Mata kuliah tidak ditemukan" });
    }

    db.run(
      "UPDATE matakuliah SET nama = ?, kode = ?, sks = ?, nilai = ?, semester = ? WHERE id = ? AND user_id = ?",
      [nama || mk.nama, kode || mk.kode, sks || mk.sks, nilai || mk.nilai, semester || mk.semester, id, req.user.id]
    );

    return res.status(200).json({ message: "Mata kuliah berhasil diupdate" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteMatakuliah = (req, res) => {
  try {
    const { id } = req.params;

    const mk = db
      .query("SELECT * FROM matakuliah WHERE id = ? AND user_id = ?")
      .get(id, req.user.id);

    if (!mk) {
      return res.status(404).json({ message: "Mata kuliah tidak ditemukan" });
    }

    db.run("DELETE FROM matakuliah WHERE id = ? AND user_id = ?", [id, req.user.id]);

    return res.status(200).json({ message: "Mata kuliah berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getIPK = (req, res) => {
  try {
    const matakuliah = db
      .query("SELECT * FROM matakuliah WHERE user_id = ? AND nilai IS NOT NULL")
      .all(req.user.id);

    if (matakuliah.length === 0) {
      return res.status(200).json({ ipk: 0, total_sks: 0 });
    }

    const nilaiToAngka = (nilai) => {
      const konversi = { A: 4, B: 3, C: 2, D: 1, E: 0 };
      return konversi[nilai] ?? 0;
    };

    let totalBobot = 0;
    let totalSks = 0;

    matakuliah.forEach((mk) => {
      totalBobot += nilaiToAngka(mk.nilai) * mk.sks;
      totalSks += mk.sks;
    });

    const ipk = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : 0;

    return res.status(200).json({ ipk: parseFloat(ipk), total_sks: totalSks });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};