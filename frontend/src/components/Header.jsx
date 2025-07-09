import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const { getCartItemCount, cart } = useCart();
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const count = getCartItemCount();
        console.log('Header: Cart count updated to:', count, 'Cart items:', cart.items);
        setCartItemCount(count);
    }, [cart, getCartItemCount]);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-900">
                            E-Commerce
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/shop" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Shop
                        </Link>
                        {user && user.userType === 'admin' && (
                            <Link to="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                Admin
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative inline-block">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors relative">
                                <svg className="h-6 w-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>

                            {cartItemCount > 0 && (
                                <div
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-white z-10"
                                    style={{ minWidth: '24px', minHeight: '24px' }}
                                >
                                    {cartItemCount}
                                </div>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                                <span className="text-sm text-gray-600">
                                    Welcome, {user.name}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
