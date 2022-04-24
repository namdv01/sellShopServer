const mongoose = require("mongoose");

const connectData = async () => {
  await mongoose.connect(process.env.DATA, () => {
    console.log("kết nối data thành công");
  });
};

module.exports = connectData;
