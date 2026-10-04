# Requirements Specification: PayCore API Service

## Functional Requirements
1. **Health Check Endpoint (`GET /health`)**:
   - Mengembalikan status `200 OK` dengan payload JSON `{"status": "UP"}`.
   - Digunakan oleh HAProxy untuk Liveness/Readiness Probe.

2. **Metrics Endpoint (`GET /metrics`)**:
   - Menyediakan metrik aplikasi standar Prometheus (RPS, Latency, Error Rate) menggunakan client library Prometheus.

3. **Transaction API (`POST /api/v1/pay`)**:
   - Menerima payload JSON: `{ "user_id": "string", "amount": number, "currency": "IDR" }`.
   - Menyimpan data transaksi ke Database (PostgreSQL / MariaDB).
   - Mengembalikan status `201 Created` dan Transaction ID.

4. **Transaction History API (`GET /api/v1/transactions`)**:
   - Mengambil daftar transaksi terbaru dari Database.

## Non-Functional Requirements (SRE & DevSecOps Ready)
1. **Configuration via Environment Variables**:
   - Tidak ada kredensial DB yang hardcoded. Harus membaca `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` dari `.env`.
2. **Non-Root Execution Ready**:
   - Aplikasi siap dijalankan di container Docker tanpa akses root.
3. **Structured JSON Logging**:
   - Semua log aplikasi dikeluarkannya dalam format JSON ke `stdout` agar mudah di-parse oleh ELK/Vector/Fluentbit.