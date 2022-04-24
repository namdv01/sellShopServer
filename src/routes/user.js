const router = require("express").Router();
const {
  createOrder,
  getOwnOrder,
  getPayment,
  completeOrder,
} = require("../controller/order.controller");
// const {
//   createCart,
//   getCart,
//   addItemToCart,
//   removeItemFromCart,
// } = require("../controller/cart.controller");
const {
  createUser,
  loginUser,
  registerUser,
  logout,
  getUser,
  addProduct,
  getProductsOnCart,
  removeProduct,
  removeAllProductOnCart,
  removeTypeProduct,
} = require("../controller/user.controller");
const { refreshToken } = require("../middleware/refreshToken");
const verifyToken = require("../middleware/verifyToken");

router.get("/create", createUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
// router.post("/getCart", verifyToken, getCart);
router.get("/refreshToken", refreshToken);
// router.post("/addItemToCart", verifyToken, addItemToCart);
// router.post("/removeItemFromCart", verifyToken, removeItemFromCart);
router.get("/logout", logout);
router.get("/getProfile", verifyToken, getUser);
router.get("/addProduct/:idProduct", verifyToken, addProduct);
router.post("/addProduct/:idProduct", verifyToken, addProduct);
router.get("/removeProduct/:idProduct", verifyToken, removeProduct);
router.get("/removeTypeProduct/:idProduct", verifyToken, removeTypeProduct);
router.get("/getProductsOnCart", verifyToken, getProductsOnCart);
router.post("/createOrder", verifyToken, createOrder);
router.get("/ownerOrder", verifyToken, getOwnOrder);
router.get("/payment/:orderId", verifyToken, getPayment);
router.post("/completeOrder", verifyToken, completeOrder);
router.get("/removeAllProductOnCart", verifyToken, removeAllProductOnCart);

module.exports = router;
