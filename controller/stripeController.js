const Product = require("../models/products");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const generatePDF = require('../pdfGenerator'); 
const fs = require("fs");
const nodemailer = require("nodemailer");



// Making purchase in the stripe
exports.makePurchase = async (req, res) => {
  const { productId } = req.params;
  const { priceId, shippingDetails , profileId} = req.body;

  console.log(req.body);

  const { fullName, address, phoneNumber, state, zip, country } =
    shippingDetails;

  try {
    // Define allowed countries for shipping
    const allowedCountries = ["US", "CA", "GB", "AU", "IN"];

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: fullName,
      address: {
        line1: address,
        city: state,
        postal_code: zip,
        country: country,
      },
      phone: phoneNumber,
    });

    // Create a Checkout session on Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // Assign customer to the session
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      currency:"inr",
      shipping_address_collection: {
        allowed_countries: allowedCountries,
      },
      success_url: "http://localhost:3000/success/{CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000",
    });

    // Store session ID if needed
    const storedSessionId = session.id;
    console.log("Stored Session ID:", storedSessionId);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.log("Error making purchase:", error);
    res.status(500).json({ error: "Failed to make purchase" });
  }
};



// Get details with the session id
exports.getBookignDetails = async (req, res) => {
  const session_id = req.params;
  // const demoId  = req.params;
  console.log("session ID:", session_id.session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(
      session_id.session_id
    );
    console.log(session.payment_intent);
    res.status(200).json(session.payment_intent);
    console.log("payment intent:", session.payment_intent);
  } catch (error) {
    console.error("Error retrieving Stripe session details:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve Stripe session details" });
  }
};


// Send the receipt as email
exports.sendReceiptByEmail = async (req, res) => {
  console.log("API called for sending receipt");
  try {
    const demoId = req.params;
    const payment_intent = demoId.payment_intent;
    console.log(payment_intent);

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

    // Ensure payment intent contains valid customer information
    const customerId = paymentIntent.customer;
    if (!customerId) {
      throw new Error("Payment intent does not contain a valid customer ID");
    }

    // Read the HTML content from receipt_template.html
    let htmlContent = fs.readFileSync('receipt_template.html', 'utf8');

    // Dynamically replace placeholders in the HTML content
    htmlContent = htmlContent.replace('${paymentIntent.amount}', paymentIntent.amount);
    htmlContent = htmlContent.replace('${paymentIntent.currency.toUpperCase()}', paymentIntent.currency.toUpperCase());
    htmlContent = htmlContent.replace('${paymentIntent.shipping.name}', paymentIntent.shipping.name);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.address.line1}', paymentIntent.shipping.address.line1);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.address.city}', paymentIntent.shipping.address.city);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.address.state}', paymentIntent.shipping.address.state);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.address.postal_code}', paymentIntent.shipping.address.postal_code);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.address.country}', paymentIntent.shipping.address.country);
    htmlContent = htmlContent.replace('${paymentIntent.shipping.phone}', paymentIntent.shipping.phone);


    // Generate PDF from HTML content
    generatePDF(htmlContent, async (err, buffer) => {
      if (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: "Failed to generate PDF" });
        return;
      }


      const customer = paymentIntent.customer;

      console.log(customer);
      const recEmail = await stripe.customers.retrieve(customer);
      console.log(recEmail.email);

      // Set up Nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Specify your email service and credentials
        service: "gmail",
        auth: {
          user: "peakalpha2024@gmail.com",
          pass: "poxyctjtxyxnjxsg",
        },
      });

      // Define email options
      const mailOptions = {
        from: "Peak Alpha <peakalpha2024@gmail.com>",
        to: recEmail.email,
        subject: "Your Payment Receipt from Peak Alpha",
        html: htmlContent,
        attachments: [
          {
            filename: "New Order Receipt from Peak Alpha.pdf",
            content: buffer,
          },
        ],
      };
      
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Receipt sent successfully" });
    });
  } catch (error) {
    console.error("Error sending receipt:", error);
    res.status(500).json({ error: "Failed to send receipt" });
  }
};




