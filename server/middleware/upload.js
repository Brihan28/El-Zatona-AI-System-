const multer = require("multer");

// use memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: max 5MB
  },
});

module.exports = upload;