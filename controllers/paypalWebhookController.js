const crypto = require("crypto");
const Purchase = require("../models/Purchase");
const Youtuber = require("../models/Youtuber");
const { sendPurchaseEmails } = require("../controllers/emailController");
let fetch;
(async () => {
  fetch = (await import("node-fetch")).default;
})();

// Your PayPal webhook ID
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

// Webhook handler function
exports.handlePayPalWebhook = async (req, res) => {
  const body = req.body;

  // console.log("body : ", body);

  try {
    // Validate the PayPal webhook signature
    // const isValid = await validatePayPalSignature(req.headers, body);
    // if (!isValid) {
    //   return res.status(400).send('Invalid signature');
    // }

    // Process the event
    const eventType = body.event_type;

    // console.log("event type :", eventType);

    switch (eventType) {
      case "CHECKOUT.ORDER.APPROVED":
        console.log("Payment successful:", body.resource);
        console.log("Purchase Units :", body.resource.purchase_units);
        await recordPurchase(body.resource);
        break;

      case "CHECKOUT.ORDER.DENIED":
        console.log("Payment denied:", body.resource);
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
// Function to validate the PayPal webhook signature
const validatePayPalSignature = async (headers, body) => {
  const {
    "paypal-transmission-id": transmissionId,
    "paypal-transmission-time": transmissionTime,
    "paypal-cert-url": certUrl,
    "paypal-auth-algo": authAlgo,
    "paypal-transmission-sig": transmissionSig,
  } = headers;

  const webhookId = PAYPAL_WEBHOOK_ID;
  const bodyString = JSON.stringify(body); // Ensure body is correctly stringified

  // Fetch the PayPal certificate
  const response = await fetch(certUrl);
  const cert = await response.text();

  // Construct the string to be verified
  const stringToVerify = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto
    .createHash("sha256")
    .update(bodyString)
    .digest("hex")}`;

  // Verify the signature
  const isValid = crypto
    .createVerify(authAlgo)
    .update(stringToVerify)
    .verify(cert, transmissionSig, "base64");

  console.log("expected signature:", isValid);

  return isValid;
};

const recordPurchase = async (resource) => {
  try {
    const purchaserEmail = resource?.payer?.email_address;
    const ebookName = "YT AUTOMATION";
    const price = 27;
    const referrer = resource.purchase_units[0].custom_id; // Get referrer
    const purchaserName = resource.payer?.name?.given_name;
    const orderId = resource.id;

    console.log("Referral Id ", referrer);
    console.log("Purchaser Name :", purchaserName);

    // Check referrer validity if it exists
    if (referrer) {
      const youtuber = await Youtuber.findOne({ referralCode: referrer });
      if (!youtuber) {
        throw new Error("Invalid referral code");
      }

      // Update referrer's successful referrals
      await Youtuber.updateOne(
        { referralCode: referrer },
        { $inc: { successReferral: 1 } }
      );

      // Send emails to referrer
      sendPurchaseEmails(
        purchaserEmail,
        purchaserName,
        youtuber?.email,
        youtuber?.name,
        ebookName,
        orderId,
        youtuber?.successReferral + 1
      );
    }

    // Record purchase
    const purchase = new Purchase({
      purchaserEmail,
      ebookName,
      price,
      referrer: referrer || null, // Store referrer if available, else null
    });
    await purchase.save();

    console.log("Purchase recorded successfully!");
  } catch (error) {
    console.error("Error recording purchase:", error.message);
    throw error; // Pass the error to the calling function for handling
  }
};


