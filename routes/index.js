const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Home page
router.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find({ featured: true }).limit(6);
        const newProducts = await Product.find().sort({ createdAt: -1 }).limit(8);
        
        res.render('index', {
            title: 'Zearsports - Premium Motorbike Gear',
            featuredProducts,
            newProducts,
            cart: req.session.cart || []
        });
    } catch (error) {
        console.error('Home page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load home page',
            cart: req.session.cart || []
        });
    }
});

// About Us page
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us - Zearsports',
        cart: req.session.cart || []
    });
});

// Contact Us page
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us - Zearsports',
        cart: req.session.cart || [],
        message: null,
        error: null
    });
});

// Handle contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.render('contact', {
                title: 'Contact Us - Zearsports',
                cart: req.session.cart || [],
                error: 'All fields are required',
                message: null
            });
        }
        
        // Email configuration (you would need to set up actual email service)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Email content
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };
        
        // For demo purposes, we'll just show success without actually sending email
        await transporter.sendMail(mailOptions);
        
        res.render('contact', {
            title: 'Contact Us - Zearsports',
            cart: req.session.cart || [],
            message: 'Thank you for your message! We will get back to you soon.',
            error: null
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.render('contact', {
            title: 'Contact Us - Zearsports',
            cart: req.session.cart || [],
            error: 'Sorry, there was an error sending your message. Please try again.',
            message: null
        });
    }
});

// Search functionality
router.get('/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = {};
        
        if (q) {
            query.$text = { $search: q };
        }
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const products = await Product.find(query);
        
        res.render('search', {
            title: `Search Results - Zearsports`,
            products,
            searchQuery: q || '',
            selectedCategory: category || 'all',
            cart: req.session.cart || []
        });
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Search functionality is currently unavailable',
            cart: req.session.cart || []
        });
    }
});

module.exports = router;

