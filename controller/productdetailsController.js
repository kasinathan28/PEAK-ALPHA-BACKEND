const Product = require("../models/products");


exports.getProductDetails = async (req, res) => {
  console.log("api called");
    try {
      const productId = req.params.productId;
      // Fetch product details from the database based on the product ID
      const productDetails = await Product.findById(productId);
  
      if (!productDetails) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ product: productDetails });
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };