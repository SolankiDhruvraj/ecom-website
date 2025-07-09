# E-commerce Collaboration Platform

A full-stack e-commerce application with Stripe payment integration, built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication and authorization
- 🛒 Shopping cart functionality
- 💳 Stripe payment integration
- 📱 Responsive design with Tailwind CSS
- 🎯 Product management
- 📦 Order management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd ecom-collab
npm run install-all

# Configure Stripe
npm run setup

# Start the application
npm run dev
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecom-collab
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecom-collab

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Server
PORT=3001
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API
VITE_API_URL=http://localhost:3001
```

### 4. Stripe Configuration

**Option 1: Use the setup script (Recommended)**
```bash
node setup-stripe.js
```

**Option 2: Manual configuration**
1. Sign up for a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Replace the placeholder keys in the `.env` files with your actual Stripe keys

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

### 5. Database Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` in the backend `.env` file to point to your MongoDB instance.

### 6. Running the Application

**Option 1: Run both frontend and backend together (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /v1/api/auth/register` - User registration
- `POST /v1/api/auth/login` - User login
- `GET /v1/api/auth/profile` - Get user profile

### Products
- `GET /v1/api/products` - Get all products
- `GET /v1/api/products/:id` - Get product by ID

### Cart
- `GET /v1/api/cart` - Get user cart
- `POST /v1/api/cart/addToCart` - Add item to cart
- `PUT /v1/api/cart/updateQuantity` - Update item quantity
- `DELETE /v1/api/cart/removeItem` - Remove item from cart
- `DELETE /v1/api/cart/clearCart` - Clear cart

### Checkout
- `POST /v1/api/checkout/create-payment-intent` - Create Stripe payment intent
- `POST /v1/api/checkout/confirm-payment` - Confirm payment
- `GET /v1/api/checkout/payment-status/:paymentIntentId` - Get payment status

## Project Structure

```
ecom-collab/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── stripe.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── checkout.controller.js
│   │   └── product.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── cart.models.js
│   │   ├── order.models.js
│   │   ├── product.models.js
│   │   └── user.models.js
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── checkout.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CheckoutForm.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── authContext.jsx
    │   │   └── cartContext.jsx
    │   ├── pages/
    │   │   ├── cart.jsx
    │   │   ├── home.jsx
    │   │   ├── login.jsx
    │   │   ├── productDetails.jsx
    │   │   ├── register.jsx
    │   │   └── shop.jsx
    │   └── services/
    │       └── api.js
    └── package.json
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payments
- Zod for validation

### Frontend
- React
- React Router
- Axios for API calls
- Stripe Elements
- Tailwind CSS
- Vite

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- CORS configuration
- Environment variable protection

## Payment Flow

1. User adds items to cart
2. User proceeds to checkout
3. Frontend creates payment intent via backend
4. User enters card details using Stripe Elements
5. Payment is processed through Stripe
6. Backend confirms payment and creates order
7. Cart is cleared and user is redirected to success page

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the `MONGODB_URI` in your `.env` file

2. **Stripe Payment Errors**
   - Verify your Stripe keys are correct
   - Use test card numbers for testing
   - Check Stripe Dashboard for error logs

3. **CORS Errors**
   - Ensure the frontend proxy is configured correctly
   - Check that the backend CORS settings include your frontend URL

4. **Port Conflicts**
   - Backend runs on port 5000 by default
   - Frontend runs on port 5173 by default
   - Update ports in `.env` files if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 