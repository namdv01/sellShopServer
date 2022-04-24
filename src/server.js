const express = require("express");
const app = express();
const config = require("./config/config");
config(app);

// const upload = require("./config/upload");
// const cloudinary = require("./config/cloudinary");
const connectData = require("./config/connectData");
const initRoute = require("./routes");
const cors = require("cors");
const { refreshStoreToken } = require("./middleware/refreshToken");
app.use(cors());
connectData();
initRoute(app);
setInterval(() => {
  refreshStoreToken();
}, 1000 * 60 * 60 * 24 * 10);
// app.get("/publicFile", (req, res, next) => {
//   // res.sendFile(__dirname + "/public/images/payment.png");
//   res.sendFile(__dirname + "/index.html");

// app.use(
//   "/addProductToStock",
//   upload.single("imageCloud"),
//   async (req, res, next) => {
//     try {
//       const file = await cloudinary.uploader.upload(req.file.path);
//       res.json(file);
//       // req.body.imageCloud = file.public_id;
//       // req.body.imageCloudId = file.secure_url;
//       // const value = req.body;
//       // const product = new Product(value);
//       // await product.save();
//       // res.json({ success: "đã thêm thành công sản phẩm vào kho" });
//     } catch (error) {}
//   }
// );
// });
const port = process.env.PORT || 1234;

app.listen(port, () => {
  console.log("server đã được mở tại cổng " + port);
});
