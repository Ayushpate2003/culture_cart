const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { userAuth, adminAuth } = require('../middleware/auth');
const Session = require('../models/Session');
const multer = require('multer');
const path = require('path');
const {
    validateRegistrationData,
    validateLoginData,
    hashPassword,
    comparePassword,
    generateToken,
    sanitizeInput
} = require('../utils/authUtils');

const storage = multer.diskStorage({
    destination: function(_req, _file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function(_req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async(req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate input data
        const validation = validateRegistrationData({ username, email, password, role });
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                msg: 'Validation failed',
                errors: validation.errors
            });
        }

        // Sanitize inputs
        const sanitizedData = {
            username: sanitizeInput(username),
            email: sanitizeInput(email).toLowerCase(),
            role: role || 'user'
        };

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: sanitizedData.email },
                { username: sanitizedData.username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: existingUser.email === sanitizedData.email ?
                    'User with that email already exists' :
                    'Username already taken'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = new User({
            username: sanitizedData.username,
            email: sanitizedData.email,
            password: hashedPassword,
            role: sanitizedData.role,
        });

        await user.save();

        // Generate token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        res.status(201).json({
            success: true,
            msg: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error during registration'
        });
    }
});

// @route   POST api/users/login
// @desc    Login user and return JWT token
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

        // Find user
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Check if account is banned
        if (user.role === 'banned') {
            return res.status(403).json({
                success: false,
                msg: 'Account has been suspended'
            });
        }

        // Verify password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        // Record login session
        try {
            await Session.create({
                userId: user.id,
                type: 'login',
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            });
        } catch (e) {
            console.error('Failed to record login session:', e.message);
        }

        res.json({
            success: true,
            msg: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                artisanProfile: user.artisanProfile
            }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error during login'
        });
    }
});

// Admin login moved to /api/admin/login in adminRoutes.js

// @route   POST api/users/login-or-register
// @desc    If user exists, login; otherwise, register and login
// @access  Public
router.post('/login-or-register', async(req, res) => {
    const { username, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        let user = await User.findOne({ email });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({ username: username || email.split('@')[0], email, password: hashedPassword, role: 'user' });
            await user.save();
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
        // audit: record login
        try {
            await Session.create({
                userId: user.id,
                type: 'login',
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            });
        } catch (e) {
            console.error('Failed to record login session:', e.message);
        }
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, artisanProfile: user.artisanProfile } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/logout
// @desc    Record logout event (frontend should also clear local storage)
// @access  Private
router.post('/logout', userAuth(), async(req, res) => {
    try {
        await Session.create({
            userId: req.user.id,
            type: 'logout',
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        });
        res.json({
            success: true,
            msg: 'Logged out successfully'
        });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error during logout'
        });
    }
});

// @route   GET api/users/artisans
// @desc    List artisans (basic listing of users)
// @access  Public
router.get('/artisans', async(_req, res) => {
    try {
        const users = await User.find({ role: 'artisan' }, 'username email artisanProfile');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/me
// @desc    Get own profile
// @access  Private
router.get('/me', userAuth(), async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error while fetching profile'
        });
    }
});

// @route   PUT api/users/me
// @desc    Update own profile (also allow promoting to artisan)
// @access  Private
router.put('/me', userAuth(), async(req, res) => {
    try {
        const { firstName, lastName, location, craftType, experienceYears, bio, avatarUrl, galleryImages, role } = req.body;
        const updates = {};

        // Only allow role changes for certain roles
        if (role && ['artisan', 'user'].includes(role)) {
            updates.role = role;
        }

        updates.artisanProfile = {
            firstName: sanitizeInput(firstName || ''),
            lastName: sanitizeInput(lastName || ''),
            location: sanitizeInput(location || ''),
            craftType: sanitizeInput(craftType || ''),
            experienceYears: experienceYears || 0,
            bio: sanitizeInput(bio || ''),
            avatarUrl: avatarUrl || '',
            galleryImages: galleryImages || [],
        };

        // Compute completion percent
        const filled = [firstName, lastName, location, craftType, bio].filter(Boolean).length;
        updates.artisanProfile.completedPercent = Math.round((filled / 5) * 100);

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json({
            success: true,
            msg: 'Profile updated successfully',
            user
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error while updating profile'
        });
    }
});

// @route   POST api/users/me/avatar
// @desc    Upload avatar image
// @access  Private
router.post('/me/avatar', userAuth(), upload.single('avatar'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                msg: 'No file uploaded'
            });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(req.user.id, { 'artisanProfile.avatarUrl': fileUrl }, { new: true }).select('-password');
        res.json({
            success: true,
            msg: 'Avatar uploaded successfully',
            url: fileUrl,
            user
        });
    } catch (err) {
        console.error('Avatar upload error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error while uploading avatar'
        });
    }
});

// @route   POST api/users/me/gallery
// @desc    Upload gallery images
// @access  Private
router.post('/me/gallery', userAuth(), upload.array('images', 10), async(req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'No files uploaded'
            });
        }
        const urls = (req.files || []).map(f => `/uploads/${f.filename}`);
        const user = await User.findById(req.user.id);
        const current = (user.artisanProfile && user.artisanProfile.galleryImages) ? user.artisanProfile.galleryImages : [];
        user.artisanProfile = {...(user.artisanProfile || {}), galleryImages: [...current, ...urls] };
        await user.save();
        res.json({
            success: true,
            msg: 'Gallery images uploaded successfully',
            urls,
            user: { id: user.id, artisanProfile: user.artisanProfile }
        });
    } catch (err) {
        console.error('Gallery upload error:', err.message);
        res.status(500).json({
            success: false,
            msg: 'Server error while uploading gallery images'
        });
    }
});

module.exports = router;