const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

/**
 * Password validation utility
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
function validatePassword(password) {
    const errors = [];

    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Email validation utility
 * @param {string} email - Email to validate
 * @returns {object} - Validation result with isValid and errors
 */
function validateEmail(email) {
    const errors = [];

    if (!email) {
        errors.push('Email is required');
        return { isValid: false, errors };
    }

    if (!validator.isEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Username validation utility
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and errors
 */
function validateUsername(username) {
    const errors = [];

    if (!username) {
        errors.push('Username is required');
        return { isValid: false, errors };
    }

    if (username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 20) {
        errors.push('Username must be less than 20 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Hash password utility
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password utility
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - Password match result
 */
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token
 * @param {object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} - JWT token
 */
function generateToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
}

/**
 * Generate refresh token
 * @param {object} payload - Token payload
 * @returns {string} - Refresh token
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' });
}

/**
 * Sanitize user input
 * @param {string} input - User input string
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate secure random string
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Validate registration data
 * @param {object} data - Registration data
 * @returns {object} - Validation result
 */
function validateRegistrationData(data) {
    const { username, email, password, role } = data;
    const errors = [];

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        errors.push(...usernameValidation.errors);
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        errors.push(...emailValidation.errors);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
    }

    // Validate role
    if (role && !['user', 'admin', 'artisan'].includes(role)) {
        errors.push('Invalid role specified');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate login data
 * @param {object} data - Login data
 * @returns {object} - Validation result
 */
function validateLoginData(data) {
    const { email, password } = data;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validatePassword,
    validateEmail,
    validateUsername,
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    generateRefreshToken,
    sanitizeInput,
    generateRandomString,
    validateRegistrationData,
    validateLoginData
};