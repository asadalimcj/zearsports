const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');

// Login page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/users/account');
    }
    
    res.render('login', {
        title: 'Login - Zearsports',
        cart: req.session.cart || [],
        error: null
    });
});

// Register page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/users/account');
    }
    
    res.render('register', {
        title: 'Register - Zearsports',
        cart: req.session.cart || [],
        error: null
    });
});

// Process login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.render('login', {
                title: 'Login - Zearsports',
                cart: req.session.cart || [],
                error: 'Invalid email or password'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.render('login', {
                title: 'Login - Zearsports',
                cart: req.session.cart || [],
                error: 'Invalid email or password'
            });
        }
        
        // Set session
        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        res.redirect('/users/account');
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login - Zearsports',
            cart: req.session.cart || [],
            error: 'An error occurred during login'
        });
    }
});

// Process registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        
        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            return res.render('register', {
                title: 'Register - Zearsports',
                cart: req.session.cart || [],
                error: 'All fields are required'
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('register', {
                title: 'Register - Zearsports',
                cart: req.session.cart || [],
                error: 'Passwords do not match'
            });
        }
        
        if (password.length < 6) {
            return res.render('register', {
                title: 'Register - Zearsports',
                cart: req.session.cart || [],
                error: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            return res.render('register', {
                title: 'Register - Zearsports',
                cart: req.session.cart || [],
                error: 'An account with this email already exists'
            });
        }
        
        // Create new user
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password
        });
        
        await user.save();
        
        // Set session
        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        res.redirect('/users/account');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Register - Zearsports',
            cart: req.session.cart || [],
            error: 'An error occurred during registration'
        });
    }
});

// User account page
router.get('/account', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    
    try {
        const user = await User.findById(req.session.user.id);
        const orders = await Order.find({ 'customerInfo.email': user.email })
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.render('account', {
            title: 'My Account - Zearsports',
            user,
            orders,
            cart: req.session.cart || []
        });
        
    } catch (error) {
        console.error('Account page error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load account page',
            cart: req.session.cart || []
        });
    }
});

// Update profile
router.post('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    
    try {
        const { firstName, lastName, phone, street, city, state, zipCode, country } = req.body;
        
        const user = await User.findById(req.session.user.id);
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.address = {
            street,
            city,
            state,
            zipCode,
            country
        };
        
        await user.save();
        
        // Update session
        req.session.user.firstName = firstName;
        req.session.user.lastName = lastName;
        
        res.redirect('/users/account?success=Profile updated successfully');
        
    } catch (error) {
        console.error('Profile update error:', error);
        res.redirect('/users/account?error=Unable to update profile');
    }
});

// Change password
router.post('/change-password', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        
        if (newPassword !== confirmNewPassword) {
            return res.redirect('/users/account?error=New passwords do not match');
        }
        
        if (newPassword.length < 6) {
            return res.redirect('/users/account?error=New password must be at least 6 characters long');
        }
        
        const user = await User.findById(req.session.user.id);
        
        const isMatch = await user.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.redirect('/users/account?error=Current password is incorrect');
        }
        
        user.password = newPassword;
        await user.save();
        
        res.redirect('/users/account?success=Password changed successfully');
        
    } catch (error) {
        console.error('Password change error:', error);
        res.redirect('/users/account?error=Unable to change password');
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Middleware to check if user is logged in
router.use('/account', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
});

module.exports = router;

