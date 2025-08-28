# Zearsports - Premium Motorbike Gear E-commerce Website

A complete e-commerce website for motorbike gear built with Node.js, Express, EJS, MongoDB, and Tailwind CSS.

## 🏍️ Project Overview

Zearsports is a premium motorbike gear e-commerce platform specializing in:
- **Motorbike Suits** - Professional racing suits and protective gear
- **Motorbike Gloves** - High-quality riding gloves with various features
- **Motorbike Boots** - Durable and comfortable riding boots

## 🚀 Features

### Core Functionality
- **Product Catalog** - Browse products by category with filtering and sorting
- **Product Details** - Detailed product pages with images, descriptions, and specifications
- **Shopping Cart** - Add/remove items, update quantities, and manage cart
- **Checkout Process** - Complete order placement with customer information
- **Email Notifications** - Order confirmation emails to customers
- **Contact Form** - AJAX-powered contact form with validation
- **About Page** - Company information and developer details

### Technical Features
- **Responsive Design** - Mobile-first design using Tailwind CSS
- **EJS Templating** - Server-side rendering with reusable components
- **MongoDB Database** - Product and order data storage
- **Session Management** - Cart persistence across sessions
- **Form Validation** - Client-side and server-side validation
- **Error Handling** - Comprehensive error pages and handling

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **EJS** - Embedded JavaScript templating
- **Nodemailer** - Email sending functionality

### Frontend
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons and visual elements
- **Vanilla JavaScript** - Client-side interactivity
- **AJAX** - Asynchronous form submissions

### Development Tools
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **multer** - File upload handling

## 📋 Prerequisites

Before running this project, make sure you have:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd zearsports-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/zearsports

# Session Configuration
SESSION_SECRET=your-super-secret-session-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=contact@zearsports.com

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
```

### 4. Start MongoDB
```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Windows
net start MongoDB
```

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
zearsports-website/
├── models/                 # Database models
│   ├── Product.js         # Product schema
│   ├── User.js           # User schema
│   └── Order.js          # Order schema
├── routes/                # Express routes
│   ├── index.js          # Main routes
│   ├── products.js       # Product routes
│   ├── cart.js           # Cart routes
│   ├── orders.js         # Order routes
│   └── users.js          # User routes
├── views/                 # EJS templates
│   ├── partials/         # Reusable components
│   │   ├── header.ejs    # Header component
│   │   └── footer.ejs    # Footer component
│   ├── index.ejs         # Homepage
│   ├── products.ejs      # Product listing
│   ├── product-detail.ejs # Product details
│   ├── cart.ejs          # Shopping cart
│   ├── checkout.ejs      # Checkout page
│   ├── about.ejs         # About page
│   ├── contact.ejs       # Contact page
│   └── error.ejs         # Error page
├── public/               # Static assets
│   ├── images/           # Product images
│   ├── css/              # Custom stylesheets
│   └── js/               # Client-side JavaScript
├── app.js                # Main application file
├── seed-data.js          # Database seeding script
├── package.json          # Project dependencies
├── .env                  # Environment variables
└── README.md             # Project documentation
```

## 🎯 Usage Guide

### For Customers
1. **Browse Products** - Visit the homepage and explore product categories
2. **View Details** - Click on any product to see detailed information
3. **Add to Cart** - Select size/color and add items to your shopping cart
4. **Checkout** - Complete your order with shipping and payment information
5. **Contact Support** - Use the contact form for any inquiries

### For Administrators
1. **Manage Products** - Add, edit, or remove products through the database
2. **View Orders** - Monitor customer orders and order status
3. **Customer Support** - Respond to customer inquiries from the contact form

## 🔒 Security Features

- **Input Validation** - All user inputs are validated and sanitized
- **Session Security** - Secure session management with encrypted cookies
- **Password Hashing** - User passwords are hashed using bcrypt
- **CSRF Protection** - Cross-site request forgery protection
- **XSS Prevention** - Cross-site scripting attack prevention

## 📧 Email Configuration

To enable email notifications:

1. **Gmail Setup** (recommended):
   - Enable 2-factor authentication
   - Generate an app-specific password
   - Use your Gmail address and app password in `.env`

2. **Other Email Providers**:
   - Configure SMTP settings in the Nodemailer setup
   - Update the email configuration in `app.js`

## 🚀 Deployment

### Local Deployment
The application is ready to run locally following the installation steps above.

### Production Deployment
For production deployment:

1. **Environment Variables** - Set production environment variables
2. **Database** - Use a production MongoDB instance (MongoDB Atlas recommended)
3. **Process Manager** - Use PM2 or similar for process management
4. **Reverse Proxy** - Configure Nginx or Apache for production serving
5. **SSL Certificate** - Enable HTTPS for secure transactions

### Cloud Deployment Options
- **Heroku** - Easy deployment with MongoDB Atlas
- **DigitalOcean** - VPS deployment with full control
- **AWS** - Scalable cloud deployment
- **Vercel/Netlify** - For static site generation (requires modification)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Product listing displays all products
- [ ] Product filtering and sorting works
- [ ] Product detail pages show correct information
- [ ] Add to cart functionality works
- [ ] Shopping cart updates correctly
- [ ] Checkout process completes successfully
- [ ] Contact form validation works
- [ ] Email notifications are sent
- [ ] Responsive design works on mobile devices

### Automated Testing
To add automated tests:
```bash
npm install --save-dev jest supertest
npm run test
```

## 🤝 Contributing

This project was developed as part of the ITE410 Web Programming course. Contributions are welcome!

### Development Team
- **Alex Rodriguez** - Full-Stack Developer
- **Sarah Chen** - Frontend Developer & Designer  
- **Michael Thompson** - Backend Developer

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@zearsports.com
- **Phone**: +1 (555) 123-4567
- **Business Hours**: Monday-Friday 9:00 AM - 6:00 PM

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce functionality
- **v1.1.0** - Added email notifications and improved UI
- **v1.2.0** - Enhanced mobile responsiveness and performance

## 🎉 Acknowledgments

- **ITE410 Course** - Web Programming course requirements
- **Tailwind CSS** - For the beautiful and responsive design
- **Font Awesome** - For the comprehensive icon library
- **MongoDB** - For the robust database solution
- **Express.js** - For the powerful web framework

---

**Zearsports** - *Ride with confidence. Gear up with Zearsports.*

