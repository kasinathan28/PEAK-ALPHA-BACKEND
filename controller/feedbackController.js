const nodemailer = require("nodemailer");
const Feedback = require("../models/feedback");



// Create a nodemailer transporter using your email service provider
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "peakalpha2024@gmail.com", // replace with your email
    pass: "erawlhpotlymhpor", // replace with your app password
  },
});

// Submit feedback
exports.submitFeedback = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newFeedback = new Feedback({
      name,
      email,
      message,
    });

    await newFeedback.save();

    // Send email with feedback
    await sendFeedbackEmail(name, email, message);

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error during feedback submission:", error);
    res.status(500).json({ error: "An error occurred during feedback submission" });
  }
};


// Function to send an email with feedback
const sendFeedbackEmail = async (name, email, message) => {
  const mailOptions = {
    from: "poppins522480@gmail.com", // replace with your email
    to: email,
    subject: "Thank you for your feedback!",
    html: `<p>Dear ${name},</p>
           <p>Thank you for your feedback:</p>
           <p>${message}</p>
           <p>Best regards,</p>
           <h2>PeakAlpha</h2>`,
  };

  // Use nodemailer to send the email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Fetch all feedbacks
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete a feedback
exports.deleteFeedBack = async (req, res) => {
  const id = req.params.id; // Get the ID of the feedback from request parameters
  console.log(id); // Log the ID for debugging
  
  try {
    const feedback = await Feedback.findByIdAndDelete(id); // Find the feedback by ID and delete it
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" }); // If feedback not found, return 404
    }
    res.status(200).json({ message: "Feedback deleted successfully" }); // Respond with success message
  } catch (error) {
    console.log("Error deleting the feedback", error);
    res.status(500).json({ error: "An error occurred while deleting feedback" }); // Respond with error status
  }
}