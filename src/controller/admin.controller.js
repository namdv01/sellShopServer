const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Order = require("../models/Order");
const Item = require("../models/Item");
const Info = require("../models/Info");
// const upload = require("../config/upload");
const getSumUser = async (req, res, next) => {
  try {
    const users = await User.find({ position: "customer" });
    res.status(200).json({ success: "tổng số người dùng", sum: users.length });
  } catch (error) {
    res.json(400).json(error);
  }
};

const getSumOrderComplete = async (req, res, next) => {
  try {
    const orders = await Order.find({ status: "complete" });
    res.status(200).json({ success: "tổng số đơn hàng", sum: orders.length });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getFullUsers = async (req, res, next) => {
  try {
    // const items = await Item.find().populate("user")
    const users = await User.find({ position: "customer" });
    // const carts = await Cart.populate("")
    res.status(200).json({ success: "  người dùng", users: users });
  } catch (error) {
    res.json(400).json(error);
  }
};

const getSumProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: "tổng số sản phẩm", sum: products.length });
  } catch (error) {
    res.json(400).json(error);
  }
};

const getSumOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: "tổng số đơn hàng ", sum: orders.length });
  } catch (error) {
    res.json(400).json(error);
  }
};

const getSumMoney = async (req, res, next) => {
  try {
    const x = await Order.find()
      .populate({
        path: "details",
        populate: "product",
      })
      .exec((err, orders) => {
        var money = 0;
        orders.forEach((order) => {
          order.details.forEach((detail) => {
            money += detail.quantity * detail.product.price;
          });
        });
        res
          .status(200)
          .json({ success: "tổng sản phẩm thành công", money: money });
      });
  } catch (error) {
    res.status(400).json({ fail: "không thể trả lại tổng tiền hàng" });
  }
};
const getTranMoney = async (req, res, next) => {
  try {
    const x = await Order.find({ status: "complete" })
      .populate({
        path: "details",
        populate: "product",
      })
      .exec((err, orders) => {
        var money = 0;
        orders.forEach((order) => {
          order.details.forEach((detail) => {
            money += detail.quantity * detail.product.price;
          });
        });
        res
          .status(200)
          .json({ success: "tổng sản phẩm thành công", money: money });
      });
  } catch (error) {
    res.status(400).json({ fail: "không thể trả lại tổng tiền hàng" });
  }
};

const addProductToStock = async (req, res, next) => {
  try {
    const file = await cloudinary.uploader.upload(req.file.path);
    req.body.imageCloudId = file.public_id;
    req.body.imageCloud = file.secure_url;
    console.log(req.body);
    const value = req.body;
    const product = new Product(value);
    await product.save();
    res.status(200).json({ success: "đã thêm thành công sản phẩm vào kho" });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getFullProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: "Lấy sản phẩm thành công", products });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const removeProductFromStock = async (req, res, next) => {
  try {
    const idProduct = req.params.idProduct;
    const product = await Product.findByIdAndDelete(idProduct);
    await cloudinary.uploader.destroy(product.imageCloudId);
    res.status(200).json({
      success: "Xóa thành công",
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const updateProductOnStock = async (req, res, next) => {
  try {
    const idProduct = req.params.idProduct;

    const oriProduct = await Product.findById(idProduct);
    await cloudinary.uploader.destroy(oriProduct.imageCloudId);

    const updateProduct = req.body;
    const file = await cloudinary.uploader.upload(req.file.path);
    req.body.imageCloudId = file.public_id;
    req.body.imageCloud = file.secure_url;
    await Product.findByIdAndUpdate(idProduct, updateProduct);
    res.status(200).json({
      success: "Update thành công",
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const fixProductOnStock = async (req, res, next) => {
  try {
    const idProduct = req.params.idProduct;
    const updateProduct = req.body;
    console.log("thông tin fix" + updateProduct.name);
    await Product.findByIdAndUpdate(idProduct, updateProduct).exec(
      (err, product) => {
        if (product)
          res.status(200).json({
            success: "Fix thành công",
          });
      }
    );
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getAllOrder = async (req, res, next) => {
  try {
    await Order.find()
      .populate({
        path: "details",
        populate: "product",
      })
      .exec((err, orders) => {
        const obj = JSON.parse(JSON.stringify(orders));
        obj.forEach((order, index) => {
          let money = 0;
          order.details.forEach((detail) => {
            money += detail.quantity * detail.product.price;
          });
          obj[index].payment = money;
        });
        // orders.toObject({ getters: true });
        // orders.payment = payment;
        res.status(200).json({
          success: "toàn bộ đơn hàng người dùng",
          orders: obj,
        });
      });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const createProfile = async (req, res, next) => {
  try {
    const newProfile = new Info({
      nameCompany: "Công ty bán sản phẩm",
      phoneContact: "0989988789",
      address: "Khu 10,Thanh Ba, Phú Thọ",
    });
    await newProfile.save();
    res.status(200).json({ success: "create profile ok" });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { nameCompany, phoneContact, address } = req.body;
    await Info.findOneAndUpdate(
      {},
      { nameCompany: nameCompany, phoneContact: phoneContact, address: address }
    ).exec((err, profile) => {
      if (profile)
        res.status(200).json({ success: "update profile thành công" });
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getProfile = async (req, res, next) => {
  try {
    await Info.find()
      .limit(1)
      .exec((err, profile) => {
        res
          .status(200)
          .json({ success: "Thông tin liên hệ", profile: profile });
      });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

module.exports = {
  addProductToStock,
  removeProductFromStock,
  updateProductOnStock,
  fixProductOnStock,
  getSumUser,
  getSumProduct,
  getSumOrder,
  getSumMoney,
  getFullUsers,
  getFullProducts,
  getSumOrderComplete,
  getTranMoney,
  createProfile,
  updateProfile,
  getAllOrder,
  getProfile,
};
