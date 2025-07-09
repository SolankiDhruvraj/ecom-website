import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';

export default function ProductCard({ product }) {
    const { addItem, updateItemQuantity, cart, cartError, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if product is in cart and get its quantity
    const cartItem = cart.items?.find(item => item.product?._id === product._id);
    const currentQuantity = cartItem?.quantity || 0;

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }

        console.log('Adding product to cart:', product.name, product._id);
        await addItem(product._id, 1);
    };

    const handleIncreaseQuantity = async () => {
        if (!user) {
            alert('Please log in to modify your cart.');
            navigate('/login');
            return;
        }

        console.log('Increasing quantity for:', product.name);
        await updateItemQuantity(product._id, currentQuantity + 1);
    };

    const handleDecreaseQuantity = async () => {
        if (!user) {
            alert('Please log in to modify your cart.');
            navigate('/login');
            return;
        }

        console.log('Decreasing quantity for:', product.name);
        await updateItemQuantity(product._id, currentQuantity - 1);
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <Link to={`/product/${product._id}`}>
                <img
                    src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/assets/placeholder.png'}
                    alt={product.name}
                    className="h-48 object-cover w-full rounded"
                />
            </Link>
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-gray-500">{formatPrice(product.price)}</p>

            {currentQuantity > 0 ? (
                // Show quantity controls if item is in cart
                <div className="mt-2 flex items-center justify-center space-x-2">
                    <button
                        onClick={handleDecreaseQuantity}
                        disabled={loading}
                        className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-600"
                    >
                        -
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">{currentQuantity}</span>
                    <button
                        onClick={handleIncreaseQuantity}
                        disabled={loading}
                        className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-green-600"
                    >
                        +
                    </button>
                </div>
            ) : (
                // Show add to cart button if item is not in cart
                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50 hover:bg-blue-700"
                >
                    {loading ? 'Adding...' : 'Add to Cart'}
                </button>
            )}

            {cartError && (
                <p className="text-red-500 text-sm mt-1">{cartError}</p>
            )}
        </div>
    );
}
