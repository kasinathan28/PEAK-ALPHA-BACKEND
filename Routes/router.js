const express = require('express');

const upload = require('../multerConfig/storageConfig');
const userController = require('../controller/userController');
const adminController = require('../controller/adminController');
const feedbackController = require('../controller/feedbackController');
const cartController = require('../controller/cartController');
const ProductDetailsController = require('../controller/productdetailsController');
const StripeController = require("../controller/stripeController");
const BookignController = require("../controller/bookingsController");
const router = new express.Router();


// users API
// Routee for signup
router.post('/signup', userController.signup);

// Router for OTP
router.post('/generateAndSendOtp', userController.generateAndSendOtp);

// Router for login
router.post('/login', userController.login);

// Router for fetching user data
router.post('/getUserData/:profileId', userController.getUserData);

// Router for updating the profile with file upload
router.post('/updateprofile', upload.single('profilePicture'), userController.updateprofile);

// router for fetching the address details of the user
router.get("/getUserAddress/:profileId", userController.getUserAddress);

// Router for   updating the address
router.put('/updateAddress/:username', userController.updateAddress);

// Router for fetching the products
router.get('/getAllproducts1', userController.getAllProducts1);

// Router for fecthing the stripe details
router.get('/getAllProducts3', userController.getAllProducts3);

// Router for adding product to the cart
router.post("/addToCart", cartController.addToCart);

// Router for updating the quantity in the cart
router.put('/updateCartItem/:productId', cartController.updateProduct);

// Router to fecth the cart items
router.get("/getCart", cartController.getCart);

// Router to fetch the details of the cart products
router.post("/getProductDetails", cartController.getProductDetails);

// Router for fetching single product details in details page
router.get("/getProductDetails/:productId", ProductDetailsController.getProductDetails);

// Router for adding new booking to the database.
router.post("/newBooking", BookignController.newBooking);

// Router for getting the user's bookings
router.get("/getUserBookings/:profileId", BookignController.getUserBookings);

// End of users API


// Admin API
// Router for admin login
router.post('/admin/login', adminController.login);

// Router for getting logged in admin 
router.get("/getAdmin/:id", adminController.getAdmin);

// Router for fetching all the product
router.get('/getAllProducts',adminController.getAllProducts);

// Router for adding new products
router.post('/addnew', upload.single('image'), adminController.addProduct);

// Update the product with ID
router.put('/updateProduct/:productId', adminController.updateProduct);

// Router to update the stripe product
router.post('/updateStripeProduct/:productId', adminController.updateStripeProduct);

// Roouter for deleting the product
// router.delete('/deleteProduct/:productId', adminController.deleteProduct);
router.delete('/deleteProduct/:productId', adminController.deleteProduct);

// Router for getting all the users in the database 
router.get('/users', adminController.getUsers);

// Router for getting all the bookings from the database.
router.get('/getBookings', BookignController.getAllBookings);

// End of admin API



// FEEDBACK API's
// Router for feedback submitting
router.post('/submit-feedback', feedbackController.submitFeedback);

// Router for fetching the feedbacks
router.get('/getFeedbacks', feedbackController.getFeedbacks);

// Router for deleting the feedbacks
router.delete("/deleteFeedBack/:id",feedbackController.deleteFeedBack);



// Stripe API's
// Router for making purchase on the stripe
router.post('/purchase/:productId', StripeController.makePurchase );

// Router for getting the details from the Session id
router.get('/getBookingDetails/:session_id', StripeController.getBookignDetails);

// crete invoice
router.post('/createInvoice/:payment_intent', StripeController.sendReceiptByEmail);



// Export Router
module.exports = router;
