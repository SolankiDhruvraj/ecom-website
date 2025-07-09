import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './authContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [] });
    const [cartError, setCartError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load cart when user changes
    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            setCart({ items: [] });
        }
    }, [user]);

    const loadCart = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            console.log('Loading cart for user:', user.email);
            const res = await api.get('/cart');
            console.log('Cart loaded:', res.data);
            setCart(res.data);
            setCartError(null);
        } catch (err) {
            console.error('Load cart error:', err.response?.data || err.message);
            setCart({ items: [] });
            setCartError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (productId, quantity = 1) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);

            console.log('Adding to cart:', { productId, quantity });
            console.log('Product ID type:', typeof productId);
            console.log('Quantity type:', typeof quantity);

            const requestData = {
                productId: String(productId),
                quantity: Number(quantity)
            };

            console.log('Request data:', requestData);

            await api.post('/cart/addToCart', requestData);

            console.log('Item added successfully, reloading cart...');
            await loadCart();
        } catch (err) {
            console.error('Add to cart error:', err.response?.data || err.message);
            console.error('Full error response:', err.response);

            if (err.response?.data?.errors) {
                console.error('Validation errors:', err.response.data.errors);
                const errorMessage = err.response.data.errors.map(e => e.message).join(', ');
                setCartError(errorMessage);
            } else {
                setCartError(err.response?.data?.message || 'Failed to add item to cart');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateItemQuantity = async (productId, newQuantity) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);

            if (newQuantity <= 0) {
                // Remove item if quantity is 0 or less
                await removeItem(productId);
                return;
            }

            console.log('Updating quantity:', { productId, newQuantity });

            await api.put(`/cart/updateQuantity`, {
                productId: String(productId),
                quantity: Number(newQuantity)
            });

            console.log('Quantity updated successfully, reloading cart...');
            await loadCart();
        } catch (err) {
            console.error('Update quantity error:', err.response?.data || err.message);
            setCartError(err.response?.data?.message || 'Failed to update quantity');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);

            console.log('Removing item:', productId);

            await api.delete(`/cart/removeItem`, {
                data: { productId: String(productId) }
            });

            console.log('Item removed successfully, reloading cart...');
            await loadCart();
        } catch (err) {
            console.error('Remove item error:', err.response?.data || err.message);
            setCartError(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setLoading(false);
        }
    };

    const getCartItemCount = () => {
        const count = cart.items?.reduce((total, item) => {
            // Only count items with valid products
            if (!item.product) {
                console.log('Skipping item with null product:', item);
                return total;
            }
            const quantity = item.quantity || 0;
            console.log('Cart item count calculation:', { item, quantity, total });
            return total + quantity;
        }, 0) || 0;

        console.log('Total cart count:', count, 'Cart items:', cart.items);
        return count;
    };

    const getCartTotal = () => {
        return cart.items?.reduce((total, item) => {
            // Only include items with valid products
            if (!item.product) {
                return total;
            }
            return total + (item.quantity * (item.product?.price || 0));
        }, 0) || 0;
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);

            await api.delete('/cart/clearCart');

            setCart({ items: [] });
            setCartError(null);
        } catch (err) {
            console.error('Clear cart error:', err.response?.data || err.message);
            setCartError(err.response?.data?.message || 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    };

    const getCartId = () => {
        return cart._id;
    };

    return (
        <CartContext.Provider value={{
            cart,
            loadCart,
            addItem,
            updateItemQuantity,
            removeItem,
            clearCart,
            getCartId,
            cartError,
            loading,
            getCartItemCount,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
