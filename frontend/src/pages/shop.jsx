import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching products...');
                const res = await api.get('/products');
                console.log('Products fetched:', res.data);
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">All Products</h2>
                <p className="text-center">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">All Products</h2>
                <p className="text-center text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">All Products</h2>
            {products.length === 0 ? (
                <p className="text-center">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(p => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
