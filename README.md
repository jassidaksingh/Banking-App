# Banking App

A simple REST API for banking operations built with Node.js, Express, and SQLite.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/jassidaksingh/Banking-App.git
   cd Banking-App
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start the server**
   ```
   npm start
   ```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Banking Operations (Protected)
- `POST /api/accounts/create` - Create account
- `POST /api/accounts/deposit/:accountNumber` - Deposit money
- `POST /api/accounts/withdraw/:accountNumber` - Withdraw money
- `GET /api/accounts/:accountNumber` - Get account details
- `GET /api/accounts/transactions/:accountNumber` - Get transaction history

## Sample Request Bodies

**Register/Login:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Create Account:**
```json
{
  "account_holder_name": "John Doe"
}
```

**Deposit/Withdraw:**
```json
{
  "amount": 100,
  "description": "Test deposit"
}
```

## API Documentation

Visit `http://localhost:3000/api-docs` for Swagger documentation.

## Testing

```
npm test
```
