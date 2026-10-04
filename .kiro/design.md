# Design Specification: PayCore API

## Tech Stack
- **Language/Framework**: Node.js dengan Express.js
- **Database**: PostgreSQL (Driver/ORM: Prisma)
- **Metrics Library**: `prom-client`
- **Logger**: `winston` atau `pino` (format JSON)

## Directory Structure
paycore-api/
├── src/
│   ├── config/        # Environment & DB config
│   ├── controllers/   # API logic & endpoints
│   ├── middlewares/   # Metrics & Logging middleware
│   ├── routes/        # Express router
│   └── app.js         # Entry point
├── .env.example
├── Dockerfile
├── package.json
└── README.md


## Database Schema (`transactions` table)
- `id`: UUID (Primary Key)
- `user_id`: VARCHAR(50)
- `amount`: DECIMAL(12, 2)
- `currency`: VARCHAR(10)
- `status`: VARCHAR(20) (SUCCESS / FAILED)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP