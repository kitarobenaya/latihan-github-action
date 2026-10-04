# Implementation Tasks

- [x] 1. Setup project Node.js / Express dasar dan install dependencies (express, prom-client, winston, dotenv, pg).
- [x] 2. Buat structured JSON logger menggunakan Winston/Pino ke stdout.
- [x] 3. Buat middleware Prometheus metrics untuk mengukur HTTP request duration & total request count.
- [x] 4. Implementasikan endpoint `GET /health` dan `GET /metrics`.
- [x] 5. Konek ke database menggunakan environment variables dan siapkan skema tabel `transactions`.
- [x] 6. Implementasikan endpoint `POST /api/v1/pay` dan `GET /api/v1/transactions`.
- [~] 7. Buat file `.env.example` dan `Dockerfile` multi-stage build non-root user.
- [~] 8. Buat file `README.md` dan panduan cara menjalankan aplikasi.