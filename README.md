# Train Diary Backend

A RESTful backend API for the **Train Diary** application — a fitness tracking system designed to record workouts, manage exercise routines, and analyze progress over time.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Hirosolo/train-diary_backend)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](https://github.com/Hirosolo/train-diary_backend/releases)

---

## Features

### Core Functionality
- User authentication (JWT-based)
- CRUD operations for workouts, exercises, and logs
- Tracking exercise performance (weight, reps, sets, notes)
- Support for multiple users and private diaries
- Integration with PostgreSQL database

### Developer Tools
- FastAPI-based RESTful architecture
- Alembic migrations for database schema
- Pydantic models for data validation
- Docker support for local development

---

## Tech Stack
- **Backend Framework:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy + Alembic
- **Authentication:** JWT (via PyJWT)
- **Containerization:** Docker + Docker Compose

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Hirosolo/train-diary_backend.git
cd train-diary_backend
```

### 2. Setup the Environment
Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # for Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following content:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/train_diary
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 4. Setup the Database
Run migrations:
```bash
alembic upgrade head
```

(Optional) Initialize with sample data:
```bash
python scripts/seed_data.py
```

### 5. Run the Development Server
```bash
uvicorn app.main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000)

---

## Docker Setup (Alternative)
```bash
docker-compose up --build
```
The backend runs on port `8000` by default.

---

## API Documentation
- Interactive docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative docs (ReDoc): [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Environment Variables
| Variable | Description | Example |
|-----------|--------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/train_diary` |
| `SECRET_KEY` | JWT signing key | `supersecretkey` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `60` |

---

## Testing
Run unit tests using pytest:
```bash
pytest
```

Generate a coverage report:
```bash
pytest --cov=app
```

---

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author
Developed by [Hirosolo](https://github.com/Hirosolo)
