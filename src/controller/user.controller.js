// const res = require("express/lib/response");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { storeToken } = require("../middleware/refreshToken");
const Item = require("../models/Item");

const createUser = async (req, res, next) => {
  const user = {
    username: "admin",
    password: "admin",
    fullName: "Đỗ Văn Nam",
    phoneNumber: "0339501427",
    position: "admin",
  };

  const data = new User(user);
  try {
    await User.deleteMany();
    await data.save();
    res.json("đã thành công");
  } catch (error) {
    res.json(error);
  }
};

const registerUser = async (req, res, next) => {
  const body = req.body;
  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);

  const user = new User(body);
  try {
    await user.save();
    // req.success = "Đăng ký thành công";
    // req.userId = user._id;
    res.status(200).json({ success: "Đăng ký thành công" });
    // next();
  } catch (error) {
    res.status(400).json({
      fail: error,
    });
  }
};

const loginUser = async (req, res, next) => {
  const body = req.body;
  const user = await User.findOne({ username: body.username });

  if (user) {
    const checkPassword = await bcrypt.compare(body.password, user.password);
    if (checkPassword) {
      const payload = {
        username: user.username,
        id: user._id,
        position: user.position,
      };
      const secretKey = process.env.SECRETKEY;
      const token = jwt.sign(payload, secretKey, { expiresIn: "60s" });
      const refreshToken = jwt.sign(payload, secretKey);
      storeToken.push(refreshToken);
      console.log("kho khi ở đăng nhập:-----------" + storeToken);
      res.status(200).json({
        success: "Đăng nhập thành công",
        token,
        refreshToken,
      });
    } else {
      res.status(400).json({
        fail: "Mật khẩu không chính xác",
      });
    }
  } else {
    res.status(401).json({
      fail: "Tài khoản không tồn tại",
    });
  }
};

const logout = async (req, res, next) => {
  const bearHeader = req.headers["authorization"];
  if (bearHeader) {
    const bear = bearHeader.split(" ");
    const token = bear[1];
    const refreshToken = bear[2];
    for (let i = 0; i < storeToken.length; i++) {
      if (storeToken[i] == refreshToken) {
        if (i == 0) {
          storeToken.shift();
        } else {
          storeToken.slice(i - 1, 1);
        }
        console.log("kho sau khi đăng xuất:------" + storeToken);
        return res.status(200).json({
          success: "Đăng xuất thành công",
        });
      }
    }
    res.status(400).json({ fail: "tài khoản không tồn tại trong hệ thống" });
  } else {
    res.status(401).json({ fail: "không tồn tại token để đăng xuất" });
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    console.log(user);
    res.status(200).json({
      success: "trả về account thành công",
      name: user.fullName,
      position: user.position,
    });
  } catch (error) {
    res.status(400).json({ fail: "không tồn tại người dùng" });
  }
};

const addProduct = async (req, res, next) => {
  try {
    const product = req.params.idProduct;
    const owner = req.userId;
    const quantity = req.body.quantity || 1;
    await Item.findOne({ owner: owner, product: product }).exec(
      async (err, item) => {
        if (item == null) {
          console.log("chưa tồn tại");
          const newItem = new Item({
            owner: owner,
            product: product,
            quantity: quantity,
          });
          await newItem.save();
          await User.findById(owner).exec(async (err3, user) => {
            console.log(user.items);
            user.items.push(newItem._id);
            // const u = user.items.filter((i) => i !== newItem._id);
            console.log(user.items);
            await User.findByIdAndUpdate(owner, { items: user.items });
          });
        } else {
          const i = item.quantity + quantity;
          await Item.findByIdAndUpdate(item._id, { quantity: i });
          console.log("đã tồn tại");
        }
      }
    );
    res.status(200).json({ success: "thêm sp thành công" });
  } catch (error) {
    res.status(400).json({ fail: "thêm ko thành công" });
  }
};

const removeProduct = async (req, res, next) => {
  try {
    const product = req.params.idProduct;
    const owner = req.userId;
    const quantity = req.body.quantity;
    await Item.findOne({ owner: owner, product: product }).exec(
      async (err, item) => {
        console.log(item.quantity);
        if (item.quantity > 1) {
          const i = item.quantity - 1;
          await Item.findByIdAndUpdate(item._id, { quantity: i });
          console.log("đã tồn tại");
        } else {
          await Item.findByIdAndRemove(item._id).exec(async (err2, oldItem) => {
            await User.findById(owner).exec(async (err3, user) => {
              const mangMoi = user.items.filter((i) => {
                if (String(i) !== String(oldItem._id)) return i;
              });
              // console.log(mangMoi);
              await User.findByIdAndUpdate(owner, { items: mangMoi });
            });
          });
        }
      }
    );
    res.status(200).json({ success: "ok" });
  } catch (error) {
    res.status(400).json({ fail: "xóa ko thành công" });
  }
};

const removeTypeProduct = async (req, res, next) => {
  try {
    const product = req.params.idProduct;
    const owner = req.userId;
    await Item.findOneAndRemove({ owner: owner, product: product }).exec(
      async (err, oldItem) => {
        await User.findById(owner).exec(async (err2, user) => {
          const mangMoi = user.items.filter((i) => {
            if (String(i) !== String(oldItem._id)) return i;
          });
          await User.findByIdAndUpdate(owner, { items: mangMoi });
        });
      }
    );
    res.status(200).json({ success: "ok" });
  } catch (error) {
    res.status(400).json({ fail: "xóa ko thành công" });
  }
};

const removeAllProductOnCart = async (req, res, next) => {
  try {
    const owner = req.userId;
    await Item.deleteMany({ owner: owner }).exec(async (err, items) => {
      await User.findByIdAndUpdate(owner, { items: [] });
    });
    res.status(200).json({ success: "ok nhá" });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

const getProductsOnCart = async (req, res, next) => {
  try {
    const owner = req.userId;
    await Item.find({ owner: owner })
      .populate("product")
      .exec((err, items) => {
        const obj = JSON.parse(JSON.stringify(items));
        let money = 0;
        obj.forEach((item, index) => {
          money += item.product.price * item.quantity;
          console.log("Giá tiền từng lúc");
        });
        obj.paymentAll = money;
        res.status(200).json({
          success: "lấy sản phẩm trong giỏ thành công",
          items: items,
          paymentAll: obj.paymentAll,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ fail: "lấy sản phẩm trong giỏ thất bại" });
  }
};

// const addConfigProduct = async (req,res,next) => {
//   try {
//     const product = req.params.idProduct;
//     const owner = req.userId;
//     const quantity = req.body.quantity;
//     await Item.findOne({owner,product}).exec((err,item) => {
//       if(item) res.status(200).json();
//     })
//   } catch (error) {
//     res.status(403).json(error);
//   }
// }

module.exports = {
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
};
