import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBConnect from './config/db.js';

import productsRoute from './routes/product.routes.js';
import authRoute from './routes/user.routes.js';
import cartRoute from './routes/cart.routes.js';
import checkoutRoute from './routes/checkout.routes.js';
// import stripeWebhookRoute from './routes/stripeWebhook.js';

dotenv.config();
const app = express();
DBConnect();

// CORS middleware FIRST
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());

// Stripe Webhook (must come before express.json)
// app.use('/api/stripe', stripeWebhookRoute); // raw body parser used in that route

app.use('/v1/api/products', productsRoute);
app.use('/v1/api/auth', authRoute);
app.use('/v1/api/cart', cartRoute);
app.use('/v1/api/checkout', checkoutRoute);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
