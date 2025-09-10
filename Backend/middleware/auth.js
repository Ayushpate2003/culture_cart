const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Enhanced authentication middleware with better error handling and user validation
function auth(requiredRoles = []) {
    return async(req, res, next) => {
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    msg: 'No token provided, authorization denied'
                });
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');

            // Check if user still exists in database
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    msg: 'User not found, token invalid'
                });
            }

            // Check if user account is active (you can add an 'active' field to user schema)
            if (user.role === 'banned') {
                return res.status(403).json({
                    success: false,
                    msg: 'Account has been suspended'
                });
            }

            // Attach user info to request
            req.user = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                artisanProfile: user.artisanProfile
            };

            // Check role permissions
            if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    msg: `Access denied. Required roles: ${requiredRoles.join(', ')}`
                });
            }

            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    msg: 'Invalid token'
                });
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    msg: 'Token has expired'
                });
            } else {
                console.error('Auth middleware error:', err);
                return res.status(500).json({
                    success: false,
                    msg: 'Server error during authentication'
                });
            }
        }
    };
}

// Middleware specifically for admin access
function adminAuth() {
    return auth(['admin']);
}

// Middleware for user and admin access
function userAuth() {
    return auth(['user', 'admin', 'artisan']);
}

// Middleware for artisan access
function artisanAuth() {
    return auth(['artisan', 'admin']);
}

module.exports = {
    auth,
    adminAuth,
    userAuth,
    artisanAuth
};