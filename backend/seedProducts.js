import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.models.js';

dotenv.config();

const sampleProducts = [
    {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with advanced features and powerful performance",
        price: 999.99,
        brand: "Apple",
        category: "Electronics",
        countInStock: 10,
        image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro"
    },
    {
        name: "Samsung Galaxy S24",
        description: "Premium Android smartphone with cutting-edge technology",
        price: 899.99,
        brand: "Samsung",
        category: "Electronics",
        countInStock: 15,
        image: "https://via.placeholder.com/300x300?text=Samsung+Galaxy+S24"
    },
    {
        name: "MacBook Pro M3",
        description: "Professional laptop with M3 chip for ultimate performance",
        price: 1999.99,
        brand: "Apple",
        category: "Computers",
        countInStock: 8,
        image: "https://via.placeholder.com/300x300?text=MacBook+Pro+M3"
    },
    {
        name: "Nike Air Max 270",
        description: "Comfortable running shoes with excellent cushioning",
        price: 129.99,
        brand: "Nike",
        category: "Footwear",
        countInStock: 25,
        image: "https://via.placeholder.com/300x300?text=Nike+Air+Max+270"
    },
    {
        name: "Sony WH-1000XM5",
        description: "Premium noise-cancelling headphones with exceptional sound quality",
        price: 349.99,
        brand: "Sony",
        category: "Electronics",
        countInStock: 12,
        image: "https://via.placeholder.com/300x300?text=Sony+WH-1000XM5"
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`Added ${products.length} sample products`);

        console.log('Sample products:');
        products.forEach(product => {
            console.log(`- ${product.name} (ID: ${product._id}) - $${product.price}`);
        });

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts(); 