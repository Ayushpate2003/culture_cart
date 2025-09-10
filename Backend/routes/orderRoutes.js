const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, userAuth, adminAuth } = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create a new order
// @access  Public (attach auth in real app)
router.post('/', auth(['user', 'admin', 'artisan']), async(req, res) => {
    try {
        const { customerEmail, products, total, status } = req.body;
        if (!customerEmail || !Array.isArray(products) || products.length === 0 || typeof total !== 'number') {
            return res.status(400).json({ msg: 'Invalid order payload' });
        }

        const newOrder = new Order({ customerEmail, products, total, status });
        await newOrder.save();
        res.status(201).json({ msg: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders
// @desc    List all orders
// @access  Private (admin)
router.get('/', auth(['admin']), async(_req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;