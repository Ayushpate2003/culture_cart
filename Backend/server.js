const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware

app.use(cors());
app.use(express.json()); // Allows us to use req.body
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.set('strictQuery', true); // Suppress Mongoose strictQuery deprecation warning
mongoose.connect(process.env.MONGODB_URI)
    .then(async() => {
        console.log('MongoDB connected successfully');
        // Seed default admin if not exists
        try {
            const User = require('./models/user');
            const bcrypt = require('bcryptjs');
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
            const existingAdmin = await User.findOne({ email: adminEmail });
            if (!existingAdmin) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(adminPassword, salt);
                const adminUser = new User({
                    username: 'admin',
                    email: adminEmail,
                    password: hashed,
                    role: 'admin',
                });
                await adminUser.save();
                console.log('Seeded default admin:', adminEmail);
            }
        } catch (e) {
            console.error('Admin seed failed:', e.message);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Home route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Artisan Marketplace Backend API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});