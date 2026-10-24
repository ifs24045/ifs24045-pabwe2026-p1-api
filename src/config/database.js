import { Database } from "bun:sqlite";
import bcrypt from "bcryptjs";

const dbPath = process.env.VERCEL ? "/tmp/database.sqlite" : "database.sqlite";
const db = new Database(dbPath, { create: true });

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nama TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS matakuliah (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nama TEXT NOT NULL,
    kode TEXT NOT NULL,
    sks INTEGER NOT NULL,
    nilai TEXT,
    semester INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Akun uji coba untuk Web Grading (selalu tersedia di setiap instance)
const akunUji = db.query("SELECT id FROM users WHERE username = ?").get("penguji");
if (!akunUji) {
  db.run("INSERT INTO users (username, password, nama) VALUES (?, ?, ?)", [
    "penguji",
    bcrypt.hashSync("penguji123", 10),
    "Akun Penguji",
  ]);
}

export default db;