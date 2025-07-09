import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import formatPrice from '../utils/formatPrice';
import CheckoutForm from '../components/CheckoutForm';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import { isProfileComplete } from '../utils/profileUtils';

export default function Cart() {
    const { cart, loadCart, updateItemQuantity, removeItem, cartError, loading, getCartTotal } = useCart();
    const { user } = useAuth();
    const [showCheckout, setShowCheckout] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        if (user) loadCart();
    }, [user]);

    const handleQuantityChange = async (productId, newQuantity) => {
        console.log('Changing quantity for product:', productId, 'to:', newQuantity);
        await updateItemQuantity(productId, newQuantity);
    };

    const handleRemoveItem = async (productId) => {
        console.log('Removing product:', productId);
        if (!productId) {
            console.error('Product ID is undefined');
            return;
        }
        await removeItem(productId);
    };

    const handleCheckout = () => {
        // Check if profile is complete before allowing checkout
        if (!isProfileComplete(user)) {
            setShowProfileModal(true);
            return;
        }
        setShowCheckout(true);
    };

    const handleCheckoutCancel = () => {
        setShowCheckout(false);
    };

    const handleCheckoutSuccess = () => {
        setShowCheckout(false);
        // Optionally redirect to success page or show success message
        alert('Payment successful! Your order has been placed.');
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    if (!user) {
        return <p className="p-8 text-center">Please log in to view your cart.</p>;
    }

    if (loading) {
        return <p className="p-8 text-center">Loading cart...</p>;
    }

    if (cartError) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{cartError}</p>
                <button
                    onClick={loadCart}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return <p className="p-8 text-center">Your cart is empty.</p>;
    }

    // Filter out items with null products
    const validItems = cart.items.filter(item => item.product !== null);

    if (validItems.length === 0) {
        return <p className="p-8 text-center">Your cart is empty.</p>;
    }

    const total = getCartTotal();

    if (showCheckout) {
        return (
            <div className="p-8">
                <CheckoutForm
                    onSuccess={handleCheckoutSuccess}
                    onCancel={handleCheckoutCancel}
                />
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>

            {/* Profile Completion Warning */}
            {!isProfileComplete(user) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                                Complete your profile to checkout
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Please complete your profile information including shipping address before proceeding to checkout.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {validItems.map((item) => {
                    // Ensure we have the product data
                    const product = item.product;
                    const productId = product?._id || item.product;

                    console.log('Cart item:', { item, product, productId });

                    if (!product || !productId) {
                        console.error('Invalid cart item:', item);
                        return null;
                    }

                    return (
                        <div key={productId} className="border rounded p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={product.image || '/assets/placeholder.png'}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-gray-500">{formatPrice(product.price)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                        disabled={loading}
                                        className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-600"
                                    >
                                        -
                                    </button>
                                    <span className="font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                        disabled={loading}
                                        className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-green-600"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold">{formatPrice(item.quantity * product.price)}</p>
                                    <button
                                        onClick={() => handleRemoveItem(productId)}
                                        disabled={loading}
                                        className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Total:</h3>
                    <p className="text-xl font-semibold">{formatPrice(total)}</p>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading || validItems.length === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${isProfileComplete(user)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                >
                    {loading ? 'Processing...' :
                        isProfileComplete(user) ? 'Proceed to Checkout' : 'Complete Profile to Checkout'}
                </button>
            </div>

            {/* Profile Completion Modal */}
            <ProfileCompletionModal
                isOpen={showProfileModal}
                onClose={closeProfileModal}
                user={user}
            />
        </div>
    );
}
