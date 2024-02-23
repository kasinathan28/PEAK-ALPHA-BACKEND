require("dotenv").config();

const Admins = require("../models/Admin");
const Users = require("../models/Users");
const Address = require("../models/Address");
const Product = require("../models/products");
const Admin = require("../models/Admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Admin login
exports.login = async (req, res) => {
  const { adminUsername, adminPassword } = req.body;

  try {
    const admin = await Admins.findOne({ adminUsername });

    if (!admin || admin.adminPassword !== adminPassword) {
      res.status(401).json({ error: "Invalid admin username or password" });
      return;
    }
    console.log(admin);
    res.status(200).json({ message: "Admin login successful", admin });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "An error occurred during admin login" });
  }
};


// Get admin Profile
exports.getAdmin = async(req,res) =>{
  console.log("Admin profile api called.");
  const {id} = req.params;
  console.log(id);
  try{
    const admin = await Admin.findById(id);
    console.log(admin);
    return res.status(200).json(admin);
  }
  catch(error){
    console.log("Erro fetchinf the admin.", error);
  }
}


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};



// End point to add a new product.
exports.addProduct = async (req, res) => {
  try {
    const { name, brand, description, price, priceId, quantity } = req.body;

    const newProduct = new Product({
      name,
      brand,
      description,
      price,
      quantity,
      image: `http://localhost:5000/uploads/${req.file.filename}`,
    });

    await newProduct.save();

    // Create product on Stripe
    const stripeProduct = await stripe.products.create({
      name: newProduct.name,
      description: newProduct.description,
    });

    // Create price on Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100, // Stripe uses the amount in cents
      currency: "inr",
    });

    newProduct.priceId = stripePrice.id;
    newProduct.stripeId = stripeProduct.id; // Assigning Stripe product ID to stripeId field in your database
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      error: "An error occurred while adding the product",
    });
  }
};


// Update Product by ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(productId);
    const { name, brand, description, price, priceId, quantity } = req.body;

    // Fetch the existing product from MongoDB
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update product in MongoDB
    existingProduct.name = name;
    existingProduct.brand = brand;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.priceId = priceId,
    existingProduct.quantity = quantity;

    // Save the updated product in MongoDB
    await existingProduct.save();

    // Update product in Stripe
    const stripeProductId = existingProduct.stripeId; // Replace with the actual field name in your MongoDB document
    console.log(stripeProductId);
    const updatedStripeProduct = await stripe.products.update(stripeProductId, {
      name,
      description,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: existingProduct,
      stripeProduct: updatedStripeProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "An error occurred while updating the product",
    });
  }
};

// Update Stripe product
exports.updateStripeProduct = async (req, res) => {
  try {
    const stripeProductId = req.params.productId; // Assuming productId here corresponds to the Stripe product ID
    console.log(stripeProductId);
    const { name, description, price } = req.body;

    // Define the fields you want to update
    const updatedFields = {};

    if (name) {
      updatedFields.name = name;
    }

    if (description) {
      updatedFields.description = description;
    }

    // If you want to update the price, you can include it here
    if (price) {
      updatedFields.metadata = {
        ...updatedFields.metadata,
        price: price.toString(), // Convert to string or any format you prefer
      };
    }

    // Perform the update
    const updatedStripeProduct = await stripe.products.update(stripeProductId, updatedFields);

    res.status(200).json({
      message: "Stripe Product updated successfully",
      stripeProduct: updatedStripeProduct,
    });
  } catch (error) {
    console.error("Error updating Stripe product:", error);
    res.status(500).json({
      error: "An error occurred while updating the Stripe product",
    });
  }
};


// Delete Product by ID and from Stripe
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Check if the product exists in the local database
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if there are user-created prices associated with the product
    // const productInStripe = await stripe.products.retrieve(existingProduct.stripeId);
    // if (productInStripe.prices && productInStripe.prices.data.length > 0) {
    //   return res.status(400).json({ error: "Product has user-created prices" });
    // }

    // Delete the product from the local database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "An error occurred while deleting the product" });
  }
};



// API for fetching all the users in the database.
exports.getUsers = async (req, res) => {
  try {
    console.log("Fetching users...");
    // Use the `populate` method to include the corresponding address data
    const users = await Users.find().populate("addressId");
    console.log("Users fetched successfully:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};