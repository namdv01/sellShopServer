const homeRouter = require("./home");
const userRouter = require("./user");
const adminRouter = require("./admin");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const initRoute = (app) => {
  app.use("/home", homeRouter);
  app.use("/user", userRouter);
  app.use("/admin", verifyToken, verifyAdmin, adminRouter);
  // app.use("/admin", adminRouter);
};

module.exports = initRoute;
