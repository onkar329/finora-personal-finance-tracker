# Personal Finance Tracker

A full-stack Personal Finance Tracker built with React, Tailwind CSS, Express, MongoDB, JWT authentication, and Recharts.

## Features
- Register and log in with JWT authentication
- User-specific income and expense transactions
- Add, edit, delete, and filter transactions
- Dashboard totals: income, expenses, balance
- Category-wise expense pie chart and monthly trend bar chart
- Budget limits by category
- Responsive layout
- CSV export
- Environment variables for secrets

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas account

## 1. Configure the backend
```bash
cd server
copy .env.example .env
```
On macOS/Linux use `cp .env.example .env`. Edit `.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

## 2. Start the backend
```bash
npm install
npm run dev
```
The API runs on `http://localhost:8080`.

## 3. Start the frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL printed by Vite, usually `http://localhost:5173`.

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/budgets`
- `POST /api/budgets`
- `DELETE /api/budgets/:id`
- `GET /api/health`

## Notes
- Never commit `.env` files or production secrets.
- This is a learning/portfolio starter, not a regulated financial product.
- For production, use HTTPS, secure cookie-based token handling, rate limiting, stronger validation, and automated tests.
