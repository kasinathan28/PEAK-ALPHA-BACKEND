const { response } = require("express");
const Booking = require("../models/Bookings");


// Add new bookings in the database
exports.newBooking = async (req, res) => {
    const { profileId, productId, paymentIntentId } = req.body;
    console.log(req.body);
    console.log("in try for stroing new booking data");

    try {
        // Create a new booking instance
        const newBooking = new Booking({
            UserId: profileId,
            productId: productId,
            paymentIntentId: paymentIntentId
        });

        await newBooking.save();
        res.status(200).json({ message: "Booking created successfully" });
    } catch (error) {
        console.error("Error creating new booking:", error);
        res.status(500).json({ error: "Failed to create new booking" });
    }
};

// Get all the bookings from the databse.
exports.getAllBookings = async (req, res) =>{
    try {
        const response = await Booking.find();
        res.status(200).json(response);
    } catch (error) {
        console.log("Error fetching the Bookkings", error);
        res.status(500).json({message:"Error fetchig the bookings details"})
    }
}


// Show the user's bookings
exports.getUserBookings = async (req, res) => {
    const { profileId } = req.params;
    console.log("Fetching the bookings for the profile",profileId);
  
    try {
      // Find bookings by userId
      const bookings = await Booking.find({ UserId: profileId });
  
      if (bookings.length === 0) {
        // If no bookings found for the userId, return a 404 status code
        return res.status(404).json({ message: "No bookings found for the user." });
    }
    
      console.log(bookings);
      res.status(200).json(bookings);
    } catch (error) {
      console.log("Error fetching the booking details:", error);
      res.status(500).json({ error: "Failed to fetch booking details." });
    }
  };

