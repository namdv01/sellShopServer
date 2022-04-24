const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = {
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    enum: ["delivering", "complete", "cancel"],
  },
  timeCreate: {
    type: Date,
    default: Date.now,
  },
  details: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
};

const Order = Schema(schema);

module.exports = mongoose.model("order", Order);
