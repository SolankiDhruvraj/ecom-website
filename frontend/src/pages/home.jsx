import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log('Fetching products for home page...');
                const res = await api.get('/products');
                console.log('Products fetched for home:', res.data);
                // Take first 3 products as featured
                setFeaturedProducts(res.data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching products for home:', err);
                // Fallback to hardcoded data if API fails
                setFeaturedProducts([
                    { name: "Sweater", price: 49.99, image: '/images/sweater.jpg' },
                    { name: "Bag", price: 49.99, image: '/images/bag.jpg' },
                    { name: "Boots", price: 48.99, image: '/images/boots.jpg' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="text-gray-800">
            {/* Hero */}
            <section className="bg-[#f5f1ed] p-8 text-center">
                <h1 className="text-5xl font-bold mb-4">NEW ARRIVALS</h1>
                <Link to="/shop">
                    <button className="bg-black text-white px-6 py-3 rounded">SHOP NOW</button>
                </Link>
            </section>

            {/* Categories */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
                {["Women's Fashion", "Men's Fashion", "Accessories"].map((cat) => (
                    <div key={cat} className="text-center">
                        <img
                            src={
                                cat === "Women's Fashion"
                                    ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0"
                                    : cat === "Men's Fashion"
                                        ? "https://images.unsplash.com/photo-1559582798-678dfc71ccd8?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        : "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            }
                            className="rounded shadow"
                        />
                        <h3 className="mt-2 font-semibold">{cat.toUpperCase()}</h3>
                    </div>
                ))}
            </section>

            {/* Featured */}
            <section className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">FEATURED PRODUCTS</h2>
                {loading ? (
                    <p className="text-center">Loading featured products...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredProducts.map((product, i) => (
                            <ProductCard key={product._id || i} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
