const router = require("express").Router();
const {
  getHome,
  postHome,
  getAbout,
} = require("../controller/home.controller");
const {
  getProducts,
  getProductsInPage,
  getProductDetail,
  getProductsBySearch,
} = require("../controller/product.controller");
const verifyToken = require("../middleware/verifyToken");
const Item = require("../models/Item");
const User = require("../models/User");
const Order = require("../models/Order");
const { populate } = require("../models/User");
const {
  createProfile,
  updateProfile,
  getAllOrder,
} = require("../controller/admin.controller");

router.get("/", getHome);
router.post("/", postHome);
router.get("/products", getProducts);
router.get("/products/:page", getProductsInPage);
router.get("/product/:id", getProductDetail);
router.get("/searchProduct", getProductsBySearch);
router.get("/getAbout", getAbout);
router.get("/getAllOrder", getAllOrder);

// router.post("/addItem", async (req, res, next) => {
//   try {
//     const idProduct = req.body.idProduct;
//     const idUser = req.body.idUser;
//     await Item.findOne({ owner: idUser, product: idProduct }).exec(
//       async (err1, item) => {
//         if (item == null) {
//           console.log("chưa tồn tại");
//           const newItem = new Item({ owner: idUser, product: idProduct });
//           await newItem.save();
//           console.log(newItem);
//           await User.findById(idUser).exec(async (err3, user) => {
//             console.log(user.items);
//             user.items.push(newItem._id);
//             // const u = user.items.filter((i) => i !== newItem._id);
//             console.log(user.items);
//             await User.findByIdAndUpdate(idUser, { items: user.items });
//           });
//         } else {
//           item.quantity++;
//           await Item.findByIdAndUpdate(item._id, { quantity: item.quantity });
//           console.log("đã tồn tại");
//         }
//       }
//     );
//     res.status(200).json("thêm sản phẩm");
//   } catch (error) {
//     res.status(200).json("thất bại");
//   }
// });

// router.post("/removeItem", async (req, res, next) => {
//   try {
//     const idProduct = req.body.idProduct;
//     const idUser = req.body.idUser;
//     await Item.findOne({ owner: idUser, product: idProduct }).exec(
//       async (err, item) => {
//         console.log(item.quantity);
//         if (item.quantity > 1) {
//           const i = item.quantity - 1;
//           await Item.findByIdAndUpdate(item._id, { quantity: i });
//           console.log("đã tồn tại");
//         } else {
//           await Item.findByIdAndRemove(item._id).exec(async (err2, oldItem) => {
//             await User.findById(idUser).exec(async (err3, user) => {
//               const mangMoi = user.items.filter((i) => {
//                 if (String(i) !== String(oldItem._id)) return i;
//               });
//               // console.log(mangMoi);
//               await User.findByIdAndUpdate(idUser, { items: mangMoi });
//             });
//           });
//         }
//       }
//     );
//     res.status(200).json({ success: "ok" });
//   } catch (error) {}
// });
// router.get("/getMoney", async (req, res, next) => {
//   try {
//     const x = await Order.find()
//       .populate({
//         path: "details",
//         populate: "product",
//       })
//       .exec((err, orders) => {
//         var money = 0;
//         orders.forEach((order) => {
//           order.details.forEach((detail) => {
//             money += detail.quantity * detail.product.price;
//           });
//         });
//         res
//           .status(200)
//           .json({ success: "tổng sản phẩm thành công", money: money });
//       });
//   } catch (error) {
//     res.status(400).json({ fail: "không thể trả lại tổng tiền hàng" });
//   }
// });
// router.get("/getFullUsers", async (req, res, next) => {
//   try {
//     const result = await User.find({ position: "customer" });
//   } catch (error) {}
// });
// router.get("/createProfileAdmin", createProfile);
// router.post("/updateProfileAdmin", updateProfile);
module.exports = router;
