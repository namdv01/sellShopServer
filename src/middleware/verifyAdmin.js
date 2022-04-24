const verifyAdmin = (req, res, next) => {
  if (req.position === "admin") next();
  else res.json({ fail: "Không có quyền" });
};

module.exports = verifyAdmin;
