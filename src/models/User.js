const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = {
  username: {
    type: String,
    unique: true,
  },
  password: String,
  fullName: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  position: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
};

const User = Schema(schema);
module.exports = mongoose.model("user", User);
