import React, { useState } from 'react';
import api from '../services/api';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const registerSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    userType: z.enum(['user', 'admin'], { required_error: 'Please select user type' }),
});

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'user'
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);
        try {
            registerSchema.parse(form);
            const res = await api.post('/auth/register', form);
            if (res.status === 201) {
                // Redirect to login with user type pre-selected
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please log in.',
                        userType: form.userType
                    }
                });
            } else if (res.data && res.data.message) {
                setServerError(res.data.message);
            } else {
                setServerError('Registration failed');
            }
        } catch (err) {
            if (err.name === 'ZodError') {
                const fieldErrors = {};
                err.errors.forEach(({ path, message }) => {
                    fieldErrors[path[0]] = message;
                });
                setErrors(fieldErrors);
            } else if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    // Backend Zod validation errors
                    const fieldErrors = {};
                    err.response.data.errors.forEach(({ path, message }) => {
                        fieldErrors[path[0]] = message;
                    });
                    setErrors(fieldErrors);
                } else if (err.response.data.message) {
                    setServerError(err.response.data.message);
                } else {
                    setServerError('Registration failed');
                }
            } else {
                setServerError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Choose your account type to get started
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to register as:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${form.userType === 'user'
                                    ? 'border-blue-500 ring-2 ring-blue-500'
                                    : 'border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="user"
                                        checked={form.userType === 'user'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">Customer</div>
                                                <div className="text-gray-500">Shop and browse products</div>
                                            </div>
                                        </div>
                                        {form.userType === 'user' && (
                                            <div className="shrink-0 text-blue-500">
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${form.userType === 'admin'
                                    ? 'border-blue-500 ring-2 ring-blue-500'
                                    : 'border-gray-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="admin"
                                        checked={form.userType === 'admin'}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">Admin</div>
                                                <div className="text-gray-500">Manage products and orders</div>
                                            </div>
                                        </div>
                                        {form.userType === 'admin' && (
                                            <div className="shrink-0 text-blue-500">
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.userType && <p className="mt-2 text-red-500 text-sm">{errors.userType}</p>}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Error Message */}
                        {serverError && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            {serverError}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </div>
                                ) : (
                                    `Create ${form.userType === 'admin' ? 'Admin' : 'Customer'} Account`
                                )}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
