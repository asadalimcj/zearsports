// const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");

// // Contact form POST handler
// router.post("/", async (req, res) => {
//     const { name, email, subject, message } = req.body;

//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         const mailOptions = {
//             from: '"ZearSports Website" <asadalimcj@gmail.com>',
//             to: process.env.EMAIL_USER,
//             subject: `New Contact Form: ${subject}`,
//             text: `
// Name: ${name}
// Email: ${email}
// Subject: ${subject}

// Message:
// ${message}
//             `,
//             replyTo: email
//         };

//         await transporter.sendMail(mailOptions);

//         res.render("contact", { message: "✅ Your message has been sent successfully!", error: null });

//     } catch (err) {
//         console.error("Email sending error:", err);
//         res.render("contact", { message: null, error: "❌ Failed to send email. Please try again later." });
//     }
// });

// module.exports = router;
