import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userZodSchema, loginZodSchema } from '../validators/user.validator.js'
import { User } from '../models/user.models.js'

export const registerUser = async (req, res) => {
    try {
        console.log('Registration attempt:', {
            email: req.body.email,
            name: req.body.name,
            userType: req.body.userType
        });

        const validatedUser = userZodSchema.parse(req.body)
        const existingUser = await User.findOne({ email: validatedUser.email })

        if (existingUser) {
            console.log('User already exists:', validatedUser.email);
            return res.status(409).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(validatedUser.password, 10)
        validatedUser.password = hashedPassword

        const user = await User.create(validatedUser)
        console.log('User created successfully:', user._id, 'as:', user.userType);

        return res.status(201).json({
            message: "User created",
            userId: user._id,
            userType: user.userType
        })
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === "ZodError") {
            return res.status(400).json({ errors: error.errors });
        }

        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log('Login attempt:', { email: req.body.email });

        const validatedLogin = loginZodSchema.parse(req.body)
        const user = await User.findOne({ email: validatedLogin.email })

        if (!user) {
            console.log('User not found:', validatedLogin.email);
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(validatedLogin.password, user.password)
        if (!isPasswordValid) {
            console.log('Invalid password for user:', validatedLogin.email);
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Check if user type matches (for admin access)
        if (validatedLogin.userType === 'admin' && user.userType !== 'admin') {
            console.log('User attempted admin login but is not admin:', validatedLogin.email);
            return res.status(403).json({ message: "Access denied. Admin privileges required." })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                userType: user.userType
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        console.log('Login successful for user:', validatedLogin.email);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        })
    } catch (error) {
        console.error('Login error:', error);

        if (error.name === "ZodError") {
            return res.status(400).json({ errors: error.errors });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        console.log('Get profile request:', {
            userId: req.user._id,
            userEmail: req.user.email
        });

        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        console.log('Update profile request:', {
            userId: req.user._id,
            userEmail: req.user.email,
            body: req.body
        });

        const { name, phone, address } = req.body;

        // Validate required fields
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "Name is required and must be at least 3 characters" });
        }

        // Get current user to preserve email
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate address if provided
        if (address) {
            const requiredAddressFields = ['street', 'city', 'state', 'postalCode', 'country'];
            const missingFields = requiredAddressFields.filter(field => !address[field] || address[field].trim() === '');

            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: `Missing required address fields: ${missingFields.join(', ')}`
                });
            }
        }

        // Update user profile (email cannot be changed)
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name.trim(),
                email: currentUser.email, // Keep the original email
                phone: phone ? phone.trim() : undefined,
                address: address || undefined
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Profile updated for user:', updatedUser.email);

        res.json({
            message: "Profile updated successfully",
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            userType: updatedUser.userType,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors: validationErrors });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
}