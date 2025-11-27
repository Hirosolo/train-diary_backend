# Train Diary Backend

A RESTful backend API for the **Train Diary** application — a fitness tracking system that records workouts, manages routines, and analyzes performance over time.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Hirosolo/train-diary_backend)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](https://github.com/Hirosolo/train-diary_backend/releases)

---

## Features

* JWT-based authentication
* CRUD operations for workouts, exercises, and logs
* Personal training diary per user
* PostgreSQL database integration
* Express + Prisma backend structure
* Environment-based configuration

---

## Tech Stack

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Auth:** JSON Web Token (JWT)
* **Deployment:** Vercel

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Hirosolo/train-diary_backend.git
cd train-diary_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
SUPABASE_UR=<supabase url>
SUPABASE_ANON_KEY=<supabase api key>
```

### 4. Start the development server

```bash
npm run dev
```

The backend runs on [http://localhost:3000](http://localhost:3000)

---

## API Documentation

Once the server is running, visit:

* Swagger UI: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

Follow the interactive setup prompts. When asked for environment variables, add:

```
DATABASE_URL
JWT_SECRET
PORT
```

Vercel will build and deploy the backend automatically.
After deployment, your API will be available at:
`https://<your-project-name>.vercel.app`

---

## Environment Variables

| Variable       | Description                  | Example                                                     |
| -------------- | ---------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/train_diary` |
| `JWT_SECRET`   | JWT signing key              | `supersecretkey`                                            |
| `PORT`         | Local server port            | `4000`                                                      |

---

## Testing

```bash
npm test
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author

Developed by [Hirosolo](https://github.com/Hirosolo), [NortonTong](https://github.com/NortonTong)

