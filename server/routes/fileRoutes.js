const express = require("express");
const router = express.Router();


const {
  uploadFile,
  getUserFiles,
  getFileById,
  getFileDetails,
  deleteFile,
} = require("../controllers/fileController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// 🔐 PROTECTED
router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/", auth, getUserFiles);
router.get("/:id/details", auth, getFileDetails);
router.get("/:id", auth, getFileById);
router.delete("/:id", auth, deleteFile);
module.exports = router;