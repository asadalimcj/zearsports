const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Initialize cart if it doesn't exist
const initializeCart = (req) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
};

// Get cart page
router.get('/', (req, res) => {
    initializeCart(req);
    
    const cart = req.session.cart;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    res.render('cart', {
        title: 'Shopping Cart - Zearsports',
        cart,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    });
});

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        initializeCart(req);
        
        const { productId, quantity, size, color } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const qty = parseInt(quantity) || 1;
        
        // Check if item already exists in cart
        const existingItemIndex = req.session.cart.findIndex(item => 
            item.productId === productId && 
            item.size === size && 
            item.color === color
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            req.session.cart[existingItemIndex].quantity += qty;
        } else {
            // Add new item to cart
            const cartItem = {
                productId: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity: qty,
                size: size || '',
                color: color || '',
                image: product.image
            };
            
            req.session.cart.push(cartItem);
        }
        
        // Calculate cart totals
        const cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
        const cartTotal = req.session.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json({ 
                success: true, 
                message: 'Item added to cart',
                cartCount,
                cartTotal: cartTotal.toFixed(2)
            });
        } else {
            res.redirect('/cart');
        }
        
    } catch (error) {
        console.error('Add to cart error:', error);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({ error: 'Unable to add item to cart' });
        } else {
            res.redirect('/cart?error=Unable to add item to cart');
        }
    }
});

// Update cart item quantity
router.post('/update', (req, res) => {
    try {
        initializeCart(req);
        
        const { productId, size, color, quantity } = req.body;
        const qty = parseInt(quantity);
        
        if (qty <= 0) {
            return res.redirect('/cart/remove?productId=' + productId + '&size=' + size + '&color=' + color);
        }
        
        const itemIndex = req.session.cart.findIndex(item => 
            item.productId === productId && 
            item.size === size && 
            item.color === color
        );
        
        if (itemIndex > -1) {
            req.session.cart[itemIndex].quantity = qty;
        }
        
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Update cart error:', error);
        res.redirect('/cart?error=Unable to update cart');
    }
});

// Remove item from cart
router.get('/remove', (req, res) => {
    try {
        initializeCart(req);
        
        const { productId, size, color } = req.query;
        
        req.session.cart = req.session.cart.filter(item => 
            !(item.productId === productId && 
              item.size === size && 
              item.color === color)
        );
        
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.redirect('/cart?error=Unable to remove item from cart');
    }
});

// Clear entire cart
router.post('/clear', (req, res) => {
    req.session.cart = [];
    res.redirect('/cart');
});

// Get cart count (AJAX endpoint)
router.get('/count', (req, res) => {
    initializeCart(req);
    const cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    res.json({ count: cartCount });
});

module.exports = router;

