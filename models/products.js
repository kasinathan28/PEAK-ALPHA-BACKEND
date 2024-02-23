
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  priceId: {
    type: String,
    required: false,
  },
  image: String,
  quantity:{
    type:String,
    required :true,
  },
  brand: {
    type: String,
    required: false, 
  },
  stripeId:{
    type: String,
    required: false,
  }
});


const Product = mongoose.model('Product', productSchema);


module.exports = Product;