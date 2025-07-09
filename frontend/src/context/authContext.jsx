import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optionally verify token with backend
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuthStatus = async () => {
        try {
            console.log('Checking auth status...');
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token ? 'exists' : 'missing');
            console.log('API headers:', api.defaults.headers.common);

            const response = await api.get('/auth/profile');
            console.log('Profile response:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            console.error('Error response:', error.response?.data);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, userType = 'user') => {
        setAuthError('');
        try {
            console.log('Login attempt:', { email, userType });
            const response = await api.post('/auth/login', { email, password, userType });
            console.log('Login response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                console.log('Token set in localStorage and API headers');
                setUser(response.data.user);
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Login error response:', error.response?.data);
            if (error.response?.data?.message) {
                setAuthError(error.response.data.message);
            } else {
                setAuthError('Login failed. Please try again.');
            }
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setAuthError('');
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        authError,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
