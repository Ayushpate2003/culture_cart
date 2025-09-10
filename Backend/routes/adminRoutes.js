const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Session = require('../models/Session');
const { adminAuth } = require('../middleware/auth');
const {
    validateLoginData,
    comparePassword,
    generateToken,
    sanitizeInput
} = require('../utils/authUtils');

// @route   POST /api/admin/login
// @desc    Admin login (role must be admin)
// @access  Public
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input data
        const validation = validateLoginData({ email, password });
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                msg: 'Validation failed',
                errors: validation.errors
            });
        }

        // Sanitize email
        const sanitizedEmail = sanitizeInput(email).toLowerCase();

        // Find admin user
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user || user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                msg: 'Invalid admin credentials'
            });
        }

        // Check if account is banned
        if (user.role === 'banned') {
            return res.status(403).json({
                success: false,
                msg: 'Admin account has been suspended'
            });
        }

        // Verify password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid admin credentials'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        // Record admin login session
        try {
            await Session.create({
                userId: user.id,
                type: 'admin_login',
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            });
        } catch (e) {
            console.error('Failed to record admin login session:', e.message);
        }

        return res.json({
            success: true,
            msg: 'Admin login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Admin login error:', err.message);
        return res.status(500).json({
            success: false,
            msg: 'Server error during admin login'
        });
    }
});

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private (admin only)
router.get('/me', adminAuth(), async(req, res) => {
    try {
        const admin = await User.findById(req.user.id).select('-password');
        if (!admin || admin.role !== 'admin') {
            return res.status(404).json({
                success: false,
                msg: 'Admin not found'
            });
        }
        return res.json({
            success: true,
            admin
        });
    } catch (err) {
        console.error('Get admin profile error:', err.message);
        return res.status(500).json({
            success: false,
            msg: 'Server error while fetching admin profile'
        });
    }
});

// @route   POST /api/admin/logout
// @desc    Admin logout
// @access  Private (admin only)
router.post('/logout', adminAuth(), async(req, res) => {
    try {
        await Session.create({
            userId: req.user.id,
            type: 'admin_logout',
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
        res.json({
            success: true,
            msg: 'Admin logged out successfully'
        });
    } catch (err) {
        console.error('Admin logout error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error during admin logout'
        });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (admin only)
router.get('/dashboard', adminAuth(), async(req, res) => {
    try {
        // Get user statistics
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalArtisans = await User.countDocuments({ role: 'artisan' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Get recent sessions
        const recentSessions = await Session.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'username email role');

        res.json({
            success: true,
            dashboard: {
                stats: {
                    totalUsers,
                    totalArtisans,
                    totalAdmins,
                    totalUsers: totalUsers + totalArtisans + totalAdmins
                },
                recentSessions
            }
        });
    } catch (err) {
        console.error('Admin dashboard error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error while fetching dashboard data'
        });
    }
});

module.exports = router;