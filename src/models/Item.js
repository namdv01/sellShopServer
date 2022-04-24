const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = {
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
};

const Item = Schema(schema);

module.exports = mongoose.model("item", Item);
