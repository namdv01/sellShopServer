const jwt = require("jsonwebtoken");

let storeToken = [];

const refreshToken = async (req, res, next) => {
  // const { token, refreshToken } = req.body;
  const bearHeader = req.headers["authorization"];
  var token, refreshToken;
  if (bearHeader) {
    const bear = bearHeader.split(" ");
    token = bear[1];
    refreshToken = bear[2];
  }
  console.log("kho trước khi refresh:------------" + storeToken);
  if (storeToken.includes(refreshToken)) {
    const secretKey = process.env.SECRETKEY;
    const decode = jwt.verify(refreshToken, secretKey);
    const payload = {
      username: decode.username,
      id: decode.id,
      position: decode.position,
    };
    const newToken = jwt.sign(payload, secretKey, { expiresIn: "60s" });
    const newRefreshToken = jwt.sign(payload, secretKey);
    // storeToken = storeToken.filter((token) => token != refreshToken);
    for (let i = 0; i < storeToken.length; i++) {
      if (storeToken[i] == refreshToken) {
        // storeToken.slice(i, 1);
        // storeToken.push(newRefreshToken);
        //đều được cả
        storeToken[i] = newRefreshToken;
      }
    }
    console.log("kho sau khi refresh :----------- " + storeToken);
    res.status(200).json({
      success: "refreshToken thành công",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } else {
    res.status(401).json({
      fail: "refresh token thất bại",
    });
  }
};

const refreshStoreToken = () => {
  for (let i = 0; i < storeToken.length; i++) {
    storeToken.slice(0, 1);
  }
};

module.exports = { storeToken, refreshToken, refreshStoreToken };
