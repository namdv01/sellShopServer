const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = {
  nameCompany: {
    type: String,
    default: "",
  },
  phoneContact: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
};

const Info = Schema(schema);
module.exports = mongoose.model("info", Info);
