const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: "Trả về hàng hóa thành công",
      products,
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getProductsInPage = async (req, res, next) => {
  try {
    const page = req.params.page;
    const quantity = 2;
    const products = await Product.find({
      // offset: quantity * (page - 1),
      // limit: quantity,
    })
      .limit(quantity)
      .skip(quantity * (page - 1));
    res.status(200).json({
      success: `hàng hóa trang ${page}`,
      products,
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.status(200).json({
      success: "1 hàng hóa thành công",
      product,
    });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

// const postProductToStore = async (req, res, next) => {};
const getProductsBySearch = async (req, res, next) => {
  try {
    const key = req.query.searchKey;
    const price = req.query.price || 100000;
    const result = await Product.find({
      $and: [
        {
          $or: [
            { name: { $regex: ".*" + key + ".*", $options: "i" } },
            { descript: { $regex: ".*" + key + ".*", $options: "i" } },
          ],
        },
        { price: { $gt: 0, $lt: price } },
      ],
    });
    res.status(200).json({
      success: "Tìm kiếm sản phẩm thành công",
      products: result,
      searchKey: key,
    });
  } catch (error) {
    res.status(400).json({ fail: "Tìm kiếm thất bại" });
  }
};

module.exports = {
  getProducts,
  getProductsInPage,
  getProductDetail,
  getProductsBySearch,
};
