const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'artisan'],
        default: 'user',
    },
    artisanProfile: {
        firstName: { type: String },
        lastName: { type: String },
        location: { type: String },
        craftType: { type: String },
        experienceYears: { type: Number },
        bio: { type: String },
        avatarUrl: { type: String },
        galleryImages: { type: [String], default: [] },
        completedPercent: { type: Number, default: 0 },
    },
    // You can add more fields based on your project brief
    // craftDetails: String,
    // profileImageUrl: String,
});

module.exports = mongoose.model('User', userSchema);