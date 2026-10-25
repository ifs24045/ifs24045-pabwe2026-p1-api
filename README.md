# NilaiKu API (Backend)

Backend aplikasi **NilaiKu**, sistem manajemen nilai mata kuliah untuk mahasiswa. Dibangun dengan **Express.js** dan **SQLite**, menyediakan REST API untuk autentikasi (JWT), pengelolaan mata kuliah, perhitungan IPK, dan profil pengguna.

Proyek 1 - Pengembangan Aplikasi Berbasis Web (PABWE) 2026, Institut Teknologi Del.

- Frontend: https://github.com/ifs24045/ifs24045-pabwe2026-proyek1
- Demo online (API): https://ifs24045-pabwe2026-p1-api.vercel.app

## Teknologi

- [Bun](https://bun.sh) (runtime, wajib: database memakai `bun:sqlite`)
- Express.js 4
- SQLite (`bun:sqlite`)
- JSON Web Token (`jsonwebtoken`) dan `bcryptjs`
- CORS dan dotenv

## Prasyarat

- [Bun](https://bun.sh) versi 1.x terpasang. Cek dengan `bun --version`.
- Git

> Backend ini tidak dapat dijalankan dengan Node.js karena memakai modul `bun:sqlite`.

## Cara Menjalankan di Komputer Lokal

```bash
# 1. Clone repository
git clone https://github.com/ifs24045/ifs24045-pabwe2026-p1-api.git
cd ifs24045-pabwe2026-p1-api

# 2. Pasang dependensi
bun install

# 3. Buat file environment
cp .env.example .env          # Windows (CMD): copy .env.example .env

# 4. Jalankan server (auto-reload)
bun run dev
```

Jika berhasil, terminal menampilkan `Server berjalan di port 3000`. Buka http://localhost:3000 dan akan muncul:

```json
{ "message": "NilaiKu API is running" }
```

Untuk menjalankan tanpa auto-reload gunakan `bun start`.

### Variabel Environment

| Variabel     | Wajib | Keterangan                                    |
| ------------ | ----- | --------------------------------------------- |
| `JWT_SECRET` | Ya    | Kunci rahasia untuk menandatangani token JWT. |
| `PORT`       | Tidak | Port server. Default `3000`.                  |

> Tanpa `JWT_SECRET`, register berhasil tetapi login akan gagal (error 500).

### Database

Tidak perlu setup database. File `database.sqlite` dan semua tabel dibuat otomatis saat server pertama kali dijalankan. Akun uji coba berikut juga dibuat otomatis:

| Username   | Password      |
| ---------- | ------------- |
| `penguji`  | `penguji123`  |

## Menjalankan dengan Docker (opsional)

```bash
docker build -t nilaiku-api .
docker run -p 3000:3000 -e JWT_SECRET=ganti_dengan_secret_bebas nilaiku-api
```

## Dokumentasi Endpoint

Semua endpoint selain `/api/auth/*` memerlukan header `Authorization: Bearer <token>`.

### Autentikasi

| Method | Endpoint             | Body                              | Keterangan                       |
| ------ | -------------------- | --------------------------------- | -------------------------------- |
| POST   | `/api/auth/register` | `username`, `password`, `nama`    | Registrasi akun baru             |
| POST   | `/api/auth/login`    | `username`, `password`            | Login, mengembalikan `token`     |

### Mata Kuliah

| Method | Endpoint                         | Body                                    | Keterangan                                       |
| ------ | -------------------------------- | --------------------------------------- | ------------------------------------------------ |
| GET    | `/api/matakuliah`                | -                                       | Daftar mata kuliah milik pengguna                |
| GET    | `/api/matakuliah?semester=2`     | -                                       | Filter berdasarkan semester                      |
| POST   | `/api/matakuliah`                | `nama`, `kode`, `sks`, `nilai`, `semester` | Tambah mata kuliah (`nilai` opsional)         |
| PUT    | `/api/matakuliah/:id`            | `nama`, `kode`, `sks`, `nilai`, `semester` | Ubah mata kuliah                              |
| DELETE | `/api/matakuliah/:id`            | -                                       | Hapus mata kuliah                                |
| GET    | `/api/matakuliah/ipk`            | -                                       | IPK dan total SKS (hanya yang sudah bernilai)    |

### Profil

| Method | Endpoint      | Body                  | Keterangan                                  |
| ------ | ------------- | --------------------- | ------------------------------------------- |
| GET    | `/api/profil` | -                     | Data profil pengguna                        |
| PUT    | `/api/profil` | `nama`, `password`    | Perbarui nama dan/atau password             |

### Contoh Penggunaan (cURL)

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"penguji","password":"penguji123"}'

# Daftar mata kuliah (ganti TOKEN dengan token hasil login)
curl http://localhost:3000/api/matakuliah \
  -H "Authorization: Bearer TOKEN"
```

## Struktur Proyek

```
.
├── index.js              # Entry point (bun start / bun run dev)
├── index.ts              # Entry point untuk Vercel
├── Dockerfile
├── .env.example
└── src
    ├── app.js            # Konfigurasi Express, CORS, dan routing
    ├── config
    │   └── database.js   # Koneksi SQLite, pembuatan tabel, akun penguji
    ├── controllers       # Logika auth, mata kuliah, profil
    ├── middlewares       # Verifikasi JWT
    └── routes            # Definisi rute API
```

## Penulis

Thimoty Geraldino Sianipar (11S24045) - S1 Informatika, Institut Teknologi Del