# Backend Ledger

A Node.js + Express backend for a simple banking system built with MongoDB and Mongoose. The application supports user registration and login, account creation, balance checks, and secure money transfers with ledger tracking and email notifications.

## Features

- User signup and login with JWT-based authentication
- Protected account routes
- Account creation per authenticated user
- Balance enquiry for a specific account
- Transfer money between active accounts
- Idempotency protection for transaction requests
- Ledger tracking for debit and credit entries
- Transaction and registration email notifications
- MongoDB persistence with transactional updates

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for emails
- dotenv for environment management

## Project Structure

```bash
.
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a valid MongoDB connection string
- A Gmail/SMTP-compatible email setup if you want to send emails

## Installation

```bash
git clone https://github.com/cchauhan7710/Backend_Ledger.git
cd "Banking system"
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/banking-system
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
EMAIL_USER=your_email@example.com
```

## Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server starts from `server.js` and connects to MongoDB on startup.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Accounts

- `POST /api/account` - Create a new account (protected)
- `GET /api/account` - Get all accounts for the logged-in user (protected)
- `GET /api/account/balance/:accountId` - Get account balance (protected)

### Transactions

- `POST /api/transactions` - Create a transfer between accounts (protected)
- `POST /api/transactions/system/initial-funds` - Add initial funds from a system account

## Notes

- Authenticated routes require a valid JWT token.
- Transaction requests are protected with an `idempotencyKey` to avoid duplicate processing.
- All account and transaction operations are designed to keep records consistent using MongoDB transactions.

## License

This project is licensed under the ISC License.
