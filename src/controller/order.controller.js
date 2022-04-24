const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const owner = req.userId;
    const status = "delivering";
    const details = req.body.products;
    const newOrder = new Order({
      owner: owner,
      status: status,
      details: details,
    });
    await newOrder.save();
    await User.findById(owner).exec(async (err, user) => {
      user.orders.push(newOrder._id);
      await User.findByIdAndUpdate(owner, { orders: user.orders });
    });

    console.log("đơn hàng mới đc thêm vào ở đây:" + newOrder);
    res.status(200).json({ success: "Tạo đơn hàng thành công" });
  } catch (error) {
    res.status(400).json({ fail: "Tạo đơn hàng thất bại" });
  }
};

const completeOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    await Order.findByIdAndUpdate(orderId, { status: "complete" });
    res.status(200).json({ success: "Hoàn thành đơn hàng" });
  } catch (error) {
    res.status(400).json({ fail: "ko hoàn thành đơn hàng" });
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    await Order.findByIdAndUpdate(orderId, { status: "cancel" });
    res.status(200).json({ success: "Hủy đơn hàng" });
  } catch (error) {
    res.status(400).json({ fail: "ko hủy được đơn hàng" });
  }
};

const getPayment = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const payment = await Order.findById(orderId).populate("product");
    res.status(200).json({ success: "Tổng tiền đơn hàng", payment: payment });
  } catch (error) {
    res.status(400).json({ fail: "tính tổng tiền hóa hơn thất bại" });
  }
};

const getOwnOrder = async (req, res, next) => {
  try {
    await Order.find({ owner: req.userId })
      .lean()
      .populate({
        path: "details",
        populate: "product",
      })
      .exec(async (err, orders) => {
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
          success: "Đơn hàng người dùng",
          orders: obj,
        });
      });
  } catch (error) {
    res.status(400).json({ fail: "Truy xuất đơn hàng thất bại" });
  }
};

module.exports = {
  createOrder,
  getOwnOrder,
  getPayment,
  completeOrder,
  cancelOrder,
};
