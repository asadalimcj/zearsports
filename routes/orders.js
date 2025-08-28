const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");

// Checkout page
router.get("/checkout", (req, res) => {
  if (!req.session.cart || req.session.cart.length === 0) {
    return res.redirect("/cart");
  }

  const cart = req.session.cart;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  res.render("checkout", {
    title: "Checkout - Zearsports",
    cart,
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  });
});

// Process order
router.post("/place", async (req, res) => {
  try {
    if (!req.session.cart || req.session.cart.length === 0) {
      return res.redirect("/cart");
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      billingStreet,
      billingCity,
      billingState,
      billingZip,
      billingCountry,
      paymentMethod,
      notes,
    } = req.body;

    // Calculate totals
    const cart = req.session.cart;
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order items with product references
    const orderItems = [];
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product) {
        orderItems.push({
          product: product._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        });
      }
    }
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `ZS${timestamp.slice(-6)}${random}`;
    };
    // Create new order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      customerInfo: {
        firstName,
        lastName,
        email,
        phone,
      },
      shippingAddress: {
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zipCode: shippingZip,
        country: shippingCountry,
      },
      billingAddress: {
        street: billingStreet || shippingStreet,
        city: billingCity || shippingCity,
        state: billingState || shippingState,
        zipCode: billingZip || shippingZip,
        country: billingCountry || shippingCountry,
      },
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "credit_card",
      notes: notes || "",
      paymentStatus: "paid", // For demo purposes
      orderStatus: "confirmed",
    });

    await order.save();

    // Send confirmation email (demo - would need actual email service)
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue with order processing even if email fails
    }

    // Clear cart
    req.session.cart = [];

    res.render("order-success", {
      title: "Order Confirmed - Zearsports",
      order,
      cart: [],
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Unable to process your order. Please try again.",
      cart: req.session.cart || [],
    });
  }
});

// View order details
router.get("/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("items.product");

    if (!order) {
      return res.status(404).render("404", {
        title: "Order Not Found",
        cart: req.session.cart || [],
      });
    }

    res.render("order-detail", {
      title: `Order ${order.orderNumber} - Zearsports`,
      order,
      cart: req.session.cart || [],
    });
  } catch (error) {
    console.error("Order detail error:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Unable to load order details",
      cart: req.session.cart || [],
    });
  }
});

// Order tracking
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).render("404", {
        title: "Order Not Found",
        cart: req.session.cart || [],
      });
    }

    res.render("order-tracking", {
      title: `Track Order ${order.orderNumber} - Zearsports`,
      order,
      cart: req.session.cart || [],
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Unable to track order",
      cart: req.session.cart || [],
    });
  }
});

// Email configuration and sending function
async function sendOrderConfirmationEmail(order) {
  // This is a demo function - in production you would configure actual email service
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
            <td>${item.name}</td>
            <td>${item.size || "N/A"}</td>
            <td>${item.color || "N/A"}</td>
            <td>${item.quantity}</td>
        </tr>`
    )
    .join("");

  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Order Placed - ${order.orderNumber}`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Order Details</h2>
                <p>Dear ZearSport</p>                
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
                <h2>Customer Phone Number${order.customerInfo.phone}</h2>
                
                <h3>Items Ordered</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Size</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Color</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>

                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                </table>
                
                <h3>Shipping Address</h3>
                <p>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${
      order.shippingAddress.state
    } ${order.shippingAddress.zipCode}<br>
                    ${order.shippingAddress.country}
                </p>                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        `,
  };
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerInfo.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Order Confirmation</h2>
                <p>Dear ${order.customerInfo.firstName} ${
      order.customerInfo.lastName
    },</p>
                <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
                
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${order.createdAt.toLocaleDateString()}</p>
                
                <h3>Items Ordered</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Size</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Color</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>

                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                </table>
                
                <h3>Shipping Address</h3>
                <p>
                    ${order.shippingAddress.street}<br>
                    ${order.shippingAddress.city}, ${
      order.shippingAddress.state
    } ${order.shippingAddress.zipCode}<br>
                    ${order.shippingAddress.country}
                </p>
                
                <p>We will send you another email when your order ships.</p>
                <p>Thank you for choosing Zearsports!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        `,
  };

  // For demo purposes, we'll just log the email content instead of actually sending
  console.log(
    "Order confirmation email would be sent to:",
    order.customerInfo.email
  );
  // console.log("Email content:", mailOptions.html);

  // Uncomment the following line to actually send emails in production
  await transporter.sendMail(mailOptions);
  await transporter.sendMail(adminMail);
}

module.exports = router;
