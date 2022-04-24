const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    )
      callback(null, true);
    else callback(new Error("file invalid"), false);
  },
});

module.exports = upload;
