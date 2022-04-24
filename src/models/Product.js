const mongoose = require("mongoose");

const schema = {
  name: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  descript: {
    type: String,
    default: "",
  },
  imageCloud: {
    type: String,
  },
  imageCloudId: {
    type: String,
  },
  quantityInStock: {
    type: Number,
    default: 0,
  },
};

const Product = new mongoose.Schema(schema);
module.exports = mongoose.model("product", Product);
