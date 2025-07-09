import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

// Profile management routes
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

export default router