const upload = require("../config/upload");
// const cloudinary = require("../config/cloudinary");
const {
  addProductToStock,
  removeProductFromStock,
  updateProductOnStock,
  getSumUser,
  getSumProduct,
  getSumOrder,
  getSumMoney,
  getFullUsers,
  getFullProducts,
  getSumOrderComplete,
  getTranMoney,
  getAllOrder,
  getProfile,
  updateProfile,
  fixProductOnStock,
} = require("../controller/admin.controller");
const {
  cancelOrder,
  completeOrder,
} = require("../controller/order.controller");

const router = require("express").Router();
router.post("/addProductToStock", upload.single("image"), addProductToStock);
router.delete("/removeProductFromStock/:idProduct", removeProductFromStock);
router.post(
  "/updateProductOnStock/:idProduct",
  upload.single("image"),
  updateProductOnStock
);
router.post("/fixProductOnStock/:idProduct", fixProductOnStock);
router.get("/sumUser", getSumUser);
router.get("/sumProduct", getSumProduct);
router.get("/sumOrder", getSumOrder);
router.get("/sumOrderComplete", getSumOrderComplete);
router.get("/sumMoney", getSumMoney);
router.get("/tranMoney", getTranMoney);
router.get("/getFullUsers", getFullUsers);
router.get("/getFullProducts", getFullProducts);
router.post("/cancelOrder", cancelOrder);
router.post("/completeOrder", completeOrder);
router.get("/getAllOrder", getAllOrder);
router.get("/getProfile", getProfile);
router.post("/updateProfile", updateProfile);

module.exports = router;
