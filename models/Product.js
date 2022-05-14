const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true, unique: true },
    img: { type: String, required: true },
    categories: { type: Array },
    dimension: { type: Array },
    price: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
