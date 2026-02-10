// // // import nodemailer from 'nodemailer';
// // // import {
// // //     EMAIL_VERIFY_TEMPLATE,
// // //     PASSWORD_RESET_TEMPLATE
// // // } from '../config/EmailTemplates.js';
// // // import 'dotenv/config';

// // // const transport = nodemailer.createTransport({
// // //     host:"smtp.gmail.com",
// // //     port: 587,
// // //     secure: false,
// // //     auth: {
// // //         user: process.env.MAIL_USER,
// // //         pass: process.env.MAIL_PASS
// // //     }
// // // })

// // // const sendMail = async (options) => {
// // //     try {
// // //         const info = await transport.sendMail({
// // //             from: process.env.MAIL_USER,
// // //             ...options
// // //         });
// // //         console.log("Mail sent:", info.messageId);
// // //     } catch (error) {
// // //         console.error("Mail error:", error);
// // //     }
// // // };

// // // export const sendWelcomeMail = (email) =>
// // //     sendMail({
// // //         to: email,
// // //         subject: 'Welcome to Menzo Mens Wear',
// // //         text: `Account created with ${email}\nThank you for registering!`
// // //     })

// // // export const sendOtpMail = (email, otp) =>
// // //     sendMail({
// // //         to: email,
// // //         subject: 'Account verification OTP',
// // //         html: EMAIL_VERIFY_TEMPLATE
// // //             .replace('{{otp}}', otp)
// // //             .replace('{{email}}', email)
// // //     })

// // export const resetOtpMail = (email, otp) =>
// //     sendMail({
// //         to: email,
// //         subject: 'Password Reset OTP',
// //         html: PASSWORD_RESET_TEMPLATE
// //             .replace('{{otp}}', otp)
// //             .replace('{{email}}', email)
// //     })


// // import nodemailer from "nodemailer";
// // import 'dotenv/config';

// // const transporter = nodemailer.createTransport({
// //   host: "smtp-relay.brevo.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: "a20188001@smtp-brevo.com",  // Your SMTP login email
// //     pass: "xsmtpsib-493e5bbf62c858e94f78d3fbf0b2d6b841f8b2ee1bd8389504ea6ee44ba02066-yNZPG5Gk5OTUIWJD"  // Your SMTP key
// //   },
// // });

// // // Or if you prefer using environment variables:
// // // Make sure your .env file has these exact names:
// // // BREVO_SMTP_USER=a20188001@smtp-brevo.com
// // // BREVO_SMTP_KEY=xsmtpsib-...your-key-here

// // const transporterWithEnv = nodemailer.createTransport({
// //   host: "smtp-relay.brevo.com",
// //   port: 587,
// //   secure: false,
// //   auth: {
// //     user: process.env.BREVO_SMTP_USER,
// //     pass: process.env.BREVO_SMTP_KEY 
// //   },

  
// // });

// // export const sendWelcomeMail = async (email, name) => {
// //   return await transporter.sendMail({
// //     from: `"MENZO" <${process.env.BREVO_EMAIL}>`,
// //     to: email,
// //     subject: "Welcome to MENZO 👋",
// //     html: `
// //       <h2>Hello ${name}</h2>
// //       <p>Your account has been created successfully.</p>
// //     `,
// //   });
// // };

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_FROM,
//     pass: process.env.BREVO_API_KEY
//   },
// });


// export const sendWelcomeMail = async (email, name) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM,  // SIMPLE STRING - NO DISPLAY NAME
//       to: email,
//       subject: "Welcome to MENZO 👋",
//       html: `
//         <h2>Hello ${name}</h2>
//         <p>Your account has been created successfully.</p>
//       `,
//     });
//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email error:", error.message);
//     throw error;
//   }
// };


// sendMail.js
// const axios = require("axios");

import axios from "axios";

export const sendWelcomeEmail = async (email,name) => {
  try {

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
            .feature-list {
              background: white;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .feature-list li {
              margin: 10px 0;
            }
            .emoji {
              font-size: 24px;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to Our Sareeora!</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>Thank you for registering! We're thrilled to have you on board. Your account has been successfully created and you're all set to get started.</p>
            
            <div class="feature-list">
              <h3>What's Next?</h3>
              <ul>
                <li><span class="emoji">✨</span><strong>Complete Your Profile:</strong> Add more details to personalize your experience</li>
                <li><span class="emoji">🚀</span><strong>Explore Features:</strong> Discover all the amazing tools we have to offer</li>
                <li><span class="emoji">💡</span><strong>Get Started:</strong> Begin your journey with our platform</li>
                <li><span class="emoji">🤝</span><strong>Join the Community:</strong> Connect with other members</li>
              </ul>
            </div>
            
            <p style="text-align: center;">
              <a href="#" class="button">Get Started Now</a>
            </p>
            
            <p><strong>Your Account Details:</strong></p>
            <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</li>
            </ul>
            
            <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
            
            <p>Best regards,<br>
            <strong>The Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <p style="margin-top: 10px;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Gowtham", email: process.env.EMAIL_USER },
        to: [{ email, name }],
        subject: "Welcome to Sareeora! Your Account is Ready 🎉",
        htmlContent: htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Error message:", error.message);
    throw error;
  }
};

// module.exports = { sendWelcomeEmail };