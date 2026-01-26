# AgroTrace Setup

Welcome to your new AgroTrace project!

## Prerequisites
- Node.js 18+ installed.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Setup Database**:
    This project uses SQLite. You need to create the database file and apply migrations.
    ```bash
    npx prisma db push
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    - Producer Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
    - Landing Page: [http://localhost:3000](http://localhost:3000)

## Features & Notes
- **Database**: The database is a local SQLite file (`prisma/dev.db`).
- **QR Codes**: Generated codes point to `window.location.origin/trace/[id]`. In production, this would be your domain.
- **Authentication**: Currently simulated for MVP.
