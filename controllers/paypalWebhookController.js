const crypto = require('crypto');
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Your PayPal webhook ID
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

// Webhook handler function
exports.handlePayPalWebhook = async (req, res) => {
  const body = req.body;

  console.log('body : ', body);

  try {
    // Validate the PayPal webhook signature
    const isValid = await validatePayPalSignature(req.headers, body);
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }

    // Process the event
    const eventType = body.event_type;

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment successful:', body.resource);
        // Add your logic for successful payment
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        console.log('Payment denied:', body.resource);
        // Add your logic for denied payment
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

// Function to validate the PayPal webhook signature
const validatePayPalSignature = async (headers, body) => {
    const { 'paypal-transmission-id': transmissionId, 
            'paypal-transmission-time': transmissionTime, 
            'paypal-cert-url': certUrl, 
            'paypal-auth-algo': authAlgo, 
            'paypal-transmission-sig': transmissionSig } = headers;
  
    const webhookId = PAYPAL_WEBHOOK_ID;
    const bodyString = JSON.stringify(body); // Ensure body is correctly stringified
  
    // Fetch the PayPal certificate
    const response = await fetch(certUrl);
    const cert = await response.text();
  
    // Construct the string to be verified
    const stringToVerify = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('sha256').update(bodyString).digest('hex')}`;
  
    // Verify the signature
    const isValid = crypto
      .createVerify(authAlgo)
      .update(stringToVerify)
      .verify(cert, transmissionSig, 'base64');
  
    console.log('expected signature:', isValid);
  
    return isValid;
  };
  
