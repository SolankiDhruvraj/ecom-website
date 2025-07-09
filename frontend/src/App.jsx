import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Shop from './pages/shop';
import Cart from './pages/cart';
import Login from './pages/login';
import Register from './pages/register';
import ProductDetails from './pages/productDetails';
import CheckoutSuccess from './pages/checkoutSuccess';
import Admin from './pages/admin';
import Profile from './pages/profile';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout/success" element={<CheckoutSuccess />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
