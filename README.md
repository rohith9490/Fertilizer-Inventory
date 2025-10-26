# Ambassador App Backend

Backend API for the Ambassador App using Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

The `.env` file is already configured with:
- MongoDB connection string
- Port (5000)
- JWT secret

**Important**: Change the `JWT_SECRET` in production!

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users?user_type=B2B` - Get users by type
- `POST /api/users` - Create new user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product

### Stock Transfers
- `GET /api/stock-transfers` - Get all stock transfers
- `GET /api/stock-transfers/user/:userId` - Get transfers by user
- `POST /api/stock-transfers` - Create new stock transfer
- `PATCH /api/stock-transfers/:id` - Update transfer status

### Health Check
- `GET /api/health` - Check server status

## Testing the API

### Using curl:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Create User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "user_type":"B2C",
    "full_name":"Test User"
  }'
```

**Get B2B Users:**
```bash
curl http://localhost:5000/api/users?user_type=B2B
```

## Project Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   └── StockTransfer.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   └── stockTransfers.js
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Database Models

### User
- email (unique)
- password (hashed)
- user_type (B2B, B2C, ADMIN)
- shop_name
- gst_number
- full_name
- phone
- address

### Product
- product_name
- product_id (unique)
- description
- category
- unit
- is_active
- is_custom
- created_by

### StockTransfer
- b2b_user_id (optional)
- b2c_user_id (required)
- product_id (optional)
- custom_product_name
- custom_product_id
- custom_supplier_name
- custom_supplier_gst
- quantity
- price_per_unit
- total_amount
- transfer_date
- status (pending, approved, rejected, completed, received)
- notes

## Troubleshooting

**MongoDB Connection Error:**
- Check your internet connection
- Verify MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas

**Port Already in Use:**
- Change the PORT in `.env` file
- Or kill the process using port 5000

**CORS Errors:**
- The server is configured to allow all origins
- For production, update CORS settings in `server.js`

## Next Steps

1. Update the frontend API base URL in `src/lib/api.ts` to `http://localhost:5000/api`
2. Start the backend server
3. Start the frontend application
4. Test the login/signup functionality
