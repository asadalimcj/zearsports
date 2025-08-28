const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sort = req.query.sort || 'name';
        const order = req.query.order === 'desc' ? -1 : 1;
        
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const sortObj = {};
        sortObj[sort] = order;
        
        const products = await Product.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        
        res.render('products', {
            title: 'Products - Zearsports',
            products,
            currentPage: page,
            totalPages,
            category: category || 'all',
            sort,
            order: req.query.order || 'asc',
            cart: req.session.cart || []
        });
        
    } catch (error) {
        console.error('Products page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load products',
            cart: req.session.cart || []
        });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        
        const products = await Product.find({ category })
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments({ category });
        const totalPages = Math.ceil(totalProducts / limit);
        
        const categoryNames = {
            'suits': 'Motorbike Suits',
            'gloves': 'Motorbike Gloves',
            'boots': 'Motorbike Boots'
        };
        
        res.render('category', {
            title: `${categoryNames[category]} - Zearsports`,
            products,
            category,
            categoryName: categoryNames[category],
            currentPage: page,
            totalPages,
            cart: req.session.cart || []
        });
        
    } catch (error) {
        console.error('Category page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load category products',
            cart: req.session.cart || []
        });
    }
});

// Get single product details
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).render('404', {
                title: 'Product Not Found',
                cart: req.session.cart || []
            });
        }
        
        // Get related products from same category
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);
        
        res.render('product-detail', {
            title: `${product.name} - Zearsports`,
            product,
            relatedProducts,
            cart: req.session.cart || []
        });
        
    } catch (error) {
        console.error('Product detail error:', error);
        if (error.name === 'CastError') {
            return res.status(404).render('404', {
                title: 'Product Not Found',
                cart: req.session.cart || []
            });
        }
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load product details',
            cart: req.session.cart || []
        });
    }
});

// Add product review
router.post('/:id/review', async (req, res) => {
    try {
        const { user, comment, rating } = req.body;
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const review = {
            user: user || 'Anonymous',
            comment,
            rating: parseInt(rating),
            date: new Date()
        };
        
        product.reviews.push(review);
        
        // Update average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / product.reviews.length;
        
        await product.save();
        
        res.json({ success: true, review });
        
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({ error: 'Unable to submit review' });
    }
});

module.exports = router;

