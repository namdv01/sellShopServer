const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const bearHeader = req.headers["authorization"];
  if (bearHeader) {
    const bear = bearHeader.split(" ");
    const token = bear[1];
    const refreshToken = bear[2];
    console.log("đây là refrshtoken jj tke nhỉ: " + refreshToken);
    // const { token, refreshToken } = req.body;
    const secretKey = process.env.SECRETKEY;
    const decode = jwt.verify(token, secretKey, (err, data) => {
      console.log(err, data);
      if (err == null) {
        req.username = data.username;
        req.userId = data.id;
        req.position = data.position;
        next();
      } else if (err.message == "jwt expired") {
        console.log("token hết hạn");
        res.status(400).json({
          fail: "Token hết hạn",
        });
      } else res.status(401).json({ fail: "token lỗi" });
    });
    // if (decode) {

    // } else {

    // }
  } else res.status(401).json({ fail: "không tồn tại token" });
};

module.exports = verifyToken;
