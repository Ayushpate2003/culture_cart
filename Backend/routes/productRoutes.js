const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/user'); // Assuming you'll need the User model for population
const { auth, artisanAuth, adminAuth } = require('../middleware/auth');

// @route   POST api/products
// @desc    Create a new product
// @access  Private (You would add auth middleware here)
router.post('/', auth(['admin', 'artisan']), async(req, res) => {
    const { name, description, price, artisanId, images } = req.body;
    if (!name || !description || !price || !artisanId) {
        return res.status(400).json({ msg: 'Please enter all required product fields' });
    }

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            artisanId,
            images,
        });

        await newProduct.save();
        res.status(201).json({ msg: 'Product created successfully', product: newProduct });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async(req, res) => {
    try {
        const products = await Product.find().populate('artisanId', 'username');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('artisanId', 'username');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add more product-related routes here, like update and delete

// @route   PUT api/products/:id
// @desc    Update product by ID
// @access  Private (add auth middleware in real app)
router.put('/:id', auth(['admin', 'artisan']), async(req, res) => {
    try {
        const updates = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updates, { new: true }
        ).populate('artisanId', 'username');

        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json({ msg: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete product by ID
// @access  Private (add auth middleware in real app)
router.delete('/:id', auth(['admin', 'artisan']), async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ msg: 'Product deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;