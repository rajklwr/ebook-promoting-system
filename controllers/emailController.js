const { sendEmail } = require("../utils/email");

exports.sendPurchaseEmails = async (
  purchaserEmail,
  PurchaserName,
  youtuberEmail,
  youtuberName,
  ebookName,
  orderID,
  successReferral
) => {
  try {
    // HTML template for purchaser
    const purchaserTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #333;
              }
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                  background-color: #0073e6;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
              }
              .email-header img {
                  max-height: 50px;
              }
              .email-body {
                  padding: 20px;
              }
              .email-body h1 {
                  font-size: 24px;
                  color: #0073e6;
              }
              .email-body p {
                  line-height: 1.6;
                  margin: 10px 0;
              }
              .email-body .cta {
                  display: inline-block;
                  padding: 10px 20px;
                  color: #ffffff;
                  background-color: #0073e6;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .email-footer {
                  background-color: #f4f4f4;
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666;
              }
              .email-footer a {
                  color: #0073e6;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                  <img src="https://res.cloudinary.com/dm9iuudyc/image/upload/v1734018375/elixzor-consulting/Logo/elixzor_logo003_dgsuut.png" alt="Your Logo">
              </div>

              <!-- Body -->
              <div class="email-body">
                  <h1>Thank You for Your Purchase, ${PurchaserName}!</h1>
                  <p>We’re thrilled to let you know that your order has been confirmed.</p>
                  <p><strong>Order Details:</strong></p>
                  <p>Order ID: <strong>${orderID || "ORDER_1234"}</strong></p>
                  <p>Purchased Item: <strong>${ebookName}</strong></p>
                  <p>If you have any questions or need assistance, please don’t hesitate to <a href="https://elixzor-ebook.com/contact" >contact us</a>.</p>
                  <p>Enjoy your new ebook!</p>
                  <a href="https://drive.google.com/uc?id=1pJh9lmPFtEqFf-G1df6OARUe41YpN7iL&export=download" class="cta">Download Your Ebook</a>
              </div>

              <!-- Footer -->
              <div class="email-footer">
                  <p>&copy; 2024 Elixzor Media. All rights reserved.</p>
                  <p><a href="https://elixzor-ebook.com/privacy-policy">Privacy Policy</a> | <a href="https://elixzor-ebook.com/terms-conditions">Terms of Service</a></p>
              </div>
          </div>
      </body>
      </html>
    `;

    // HTML template for youtuber
    const youtuberTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #333;
              }
              .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                  background-color: #0073e6;
                  color: #ffffff;
                  text-align: center;
                  padding: 20px;
              }
              .email-header img {
                  max-height: 50px;
              }
              .email-body {
                  padding: 20px;
              }
              .email-body h1 {
                  font-size: 24px;
                  color: #0073e6;
              }
              .email-body p {
                  line-height: 1.6;
                  margin: 10px 0;
              }
              .email-body .cta {
                  display: inline-block;
                  padding: 10px 20px;
                  color: #ffffff;
                  background-color: #0073e6;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .email-footer {
                  background-color: #f4f4f4;
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666;
              }
              .email-footer a {
                  color: #0073e6;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                  <img src="https://res.cloudinary.com/dm9iuudyc/image/upload/v1734018375/elixzor-consulting/Logo/elixzor_logo003_dgsuut.png" alt="Your Logo">
              </div>
              <!-- Body -->
              <div class="email-body">
                  <h1>Referral Commission Earned, ${youtuberName}!</h1>
                  <p>We’re happy to inform you that you’ve earned a referral commission.</p>
                  <p><strong>Purchased Item:</strong> ${ebookName}</p>
                  <p><strong>Successfull Referrals : </strong> ${successReferral}</p>
                  <p><strong>Total Amount Earned : </strong> $${successReferral * Number(process.env.COMISSION_PER_REFERRAL) }</p>
                  <p>Thank you for your continued support and referrals.</p>
              </div>

              <!-- Footer -->
              <div class="email-footer">
                  <p>&copy; 2024 Elixzor Media. All rights reserved.</p>
                  <p><a href="https://elixzor-ebook.com/privacy-policy">Privacy Policy</a> | <a href="https://elixzor-ebook.com/terms-conditions">Terms of Service</a></p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email to purchaser
    await sendEmail({
      to: purchaserEmail,
      subject: "Ebook Purchase Confirmation",
      html: purchaserTemplate,
    });

    // Send email to youtuber
    if (youtuberEmail) {
      await sendEmail({
        to: youtuberEmail,
        subject: "Referral Commission Earned",
        html: youtuberTemplate,
      });
    }
  } catch (error) {
    console.error("Error sending emails:", error.message);
  }
};
