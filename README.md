# PayCore API

Layanan REST API untuk pemrosesan transaksi pembayaran. Dibangun dengan Node.js, Express, dan PostgreSQL — siap untuk deployment SRE/DevSecOps dengan observabilitas bawaan menggunakan Prometheus dan structured JSON logging via Winston.

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL 13+ |
| Metrics | prom-client (Prometheus) |
| Logger | Winston (JSON format) |

---

## Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v8 atau lebih baru
- **PostgreSQL** 13+ (built-in `gen_random_uuid()`)  
  > PostgreSQL 12 ke bawah: jalankan `CREATE EXTENSION IF NOT EXISTS pgcrypto;` terlebih dahulu.

---

## Instalasi & Setup Lokal

**1. Clone atau salin project**

```bash
git clone <repo-url> paycore-api
cd paycore-api
```

**2. Install dependencies**

```bash
npm install
```

**3. Konfigurasi environment**

Salin file template dan isi dengan nilai yang sesuai:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=paycore
```

---

## Migrasi Database

Jalankan perintah berikut untuk membuat tabel `transactions` di PostgreSQL:

```bash
npm run migrate
```

Perintah ini mengeksekusi `src/config/migrate.js` yang menjalankan `CREATE TABLE IF NOT EXISTS transactions` dengan kolom: `id` (UUID), `user_id`, `amount`, `currency`, `status`, dan `created_at`.

> Pastikan database `paycore` sudah ada sebelum menjalankan migrasi. Buat dengan: `CREATE DATABASE paycore;`

---

## Menjalankan Aplikasi

**Development** (auto-restart saat file berubah):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

Aplikasi berjalan di `http://localhost:3000` (atau port yang diset di `PORT`).

---

## Endpoint API

| Method | Path | Body / Response |
|--------|------|-----------------|
| `GET` | `/health` | Response: `{ "status": "UP" }` |
| `GET` | `/metrics` | Response: Prometheus exposition format (plain text) |
| `POST` | `/api/v1/pay` | Body: `{ "user_id": "string", "amount": number, "currency": "IDR" }` → `201 { "transaction_id": "uuid", "status": "SUCCESS" }` |
| `GET` | `/api/v1/transactions` | Response: `{ "transactions": [...] }` (100 transaksi terbaru, urutan DESC) |

### Contoh Request

**POST /api/v1/pay**

```bash
curl -X POST http://localhost:3000/api/v1/pay \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user-123", "amount": 150000, "currency": "IDR"}'
```

Response (`201 Created`):

```json
{
  "transaction_id": "a1b2c3d4-...",
  "status": "SUCCESS"
}
```

**GET /api/v1/transactions**

```bash
curl http://localhost:3000/api/v1/transactions
```

---

## Menjalankan dengan Docker

**Build image:**

```bash
docker build -t paycore-api:latest .
```

**Jalankan container** menggunakan file `.env`:

```bash
docker run -d \
  --name paycore-api \
  -p 3000:3000 \
  --env-file .env \
  paycore-api:latest
```

**Atau dengan variabel environment langsung:**

```bash
docker run -d \
  --name paycore-api \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=paycore \
  paycore-api:latest
```

> **Catatan:** Gunakan `host.docker.internal` sebagai `DB_HOST` saat PostgreSQL berjalan di host lokal (bukan di container lain).

---

## Variabel Environment

| Variabel | Deskripsi | Default |
|---|---|---|
| `PORT` | Port server Express | `3000` |
| `NODE_ENV` | Mode environment (`development` / `production`) | `development` |
| `DB_HOST` | Host server PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_USER` | Username database | `postgres` |
| `DB_PASSWORD` | Password database | *(kosong)* |
| `DB_NAME` | Nama database | `paycore` |

---

## Catatan Keamanan

- **Non-root Docker user**: Container berjalan dengan UID `1001` (non-root) sesuai best practice keamanan container.
- **Credentials dari environment**: Tidak ada kredensial database yang di-hardcode. Semua konfigurasi sensitif dibaca dari environment variables.
- **`.env` tidak dicommit**: File `.env` harus selalu masuk ke `.gitignore`. Gunakan `.env.example` sebagai template yang aman untuk di-commit.
