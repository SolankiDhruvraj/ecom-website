import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    address: z.object({
        street: z.string().min(3, 'Street must be at least 3 characters'),
        city: z.string().min(2, 'City must be at least 2 characters'),
        state: z.string().min(2, 'State must be at least 2 characters'),
        postalCode: z.string().regex(/^\d{5,6}$/, 'Postal code must be 5 or 6 digits'),
        country: z.string().min(2, 'Country must be at least 2 characters'),
    }),
});

export default function Profile() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        console.log('User data from context:', user);

        // Initialize form with user data from context
        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                postalCode: user.address?.postalCode || '',
                country: user.address?.country || '',
            }
        });

        // Load user profile data from backend
        loadProfile();
    }, [user, navigate]);

    const loadProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const profileData = response.data;

            console.log('Profile data loaded:', profileData);

            setForm(prevForm => ({
                ...prevForm,
                name: profileData.name || prevForm.name,
                email: profileData.email || prevForm.email,
                phone: profileData.phone || prevForm.phone,
                address: {
                    street: profileData.address?.street || prevForm.address.street,
                    city: profileData.address?.city || prevForm.address.city,
                    state: profileData.address?.state || prevForm.address.state,
                    postalCode: profileData.address?.postalCode || prevForm.address.postalCode,
                    country: profileData.address?.country || prevForm.address.country,
                }
            }));
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setForm(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        console.log('Submitting profile update:', form);

        try {
            profileSchema.parse(form);

            const response = await api.put('/auth/profile', form);

            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);

                // Update user context with new data
                if (updateUser) {
                    updateUser(response.data);
                }

                // Update local form state with the response data
                setForm(prevForm => ({
                    ...prevForm,
                    name: response.data.name || prevForm.name,
                    email: response.data.email || prevForm.email,
                    phone: response.data.phone || prevForm.phone,
                    address: {
                        street: response.data.address?.street || prevForm.address.street,
                        city: response.data.address?.city || prevForm.address.city,
                        state: response.data.address?.state || prevForm.address.state,
                        postalCode: response.data.address?.postalCode || prevForm.address.postalCode,
                        country: response.data.address?.country || prevForm.address.country,
                    }
                }));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error response:', error.response?.data);

            if (error.name === 'ZodError') {
                const fieldErrors = {};
                error.errors.forEach(({ path, message }) => {
                    const fieldName = path.join('.');
                    fieldErrors[fieldName] = message;
                });
                setErrors(fieldErrors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Failed to update profile' });
            }
        } finally {
            setLoading(false);
        }
    };

    const isProfileComplete = () => {
        return form.name &&
            form.email &&
            form.address.street &&
            form.address.city &&
            form.address.state &&
            form.address.postalCode &&
            form.address.country;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                                <p className="text-sm text-gray-600">
                                    Manage your account information and shipping address
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {isProfileComplete() && (
                                    <div className="flex items-center text-green-600">
                                        <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Profile Complete</span>
                                    </div>
                                )}
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadProfile(); // Reset to original data
                                        }}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mx-6 mt-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.general && (
                        <div className="mx-6 mt-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                                                    disabled={true}
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-md placeholder-gray-400 bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                                            {errors.email && <p className="mt-2 text-red-500 text-sm">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                id="street"
                                                name="address.street"
                                                value={form.address.street}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                placeholder="123 Main St"
                                            />
                                            {errors['address.street'] && <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="address.city"
                                                    value={form.address.city}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                />
                                                {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                                    State/Province *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="address.state"
                                                    value={form.address.state}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                />
                                                {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                                    Postal Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="address.postalCode"
                                                    value={form.address.postalCode}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                    placeholder="12345"
                                                />
                                                {errors['address.postalCode'] && <p className="mt-1 text-sm text-red-600">{errors['address.postalCode']}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                    Country *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="address.country"
                                                    value={form.address.country}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                />
                                                {errors['address.country'] && <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
} 