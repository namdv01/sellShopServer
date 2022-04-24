const Info = require("../models/Info");

const getHome = (req, res, next) => {
  res.json("get home");
};

const postHome = (req, res, next) => {
  res.json("post home");
};

const getAbout = async (req, res, next) => {
  try {
    await Info.find()
      .limit(1)
      .exec((err, about) => {
        res.status(200).json({ success: "Thông tin liên hệ", about: about });
      });
  } catch (error) {
    res.status(400).json({ fail: error });
  }
};

module.exports = { getHome, postHome, getAbout };
