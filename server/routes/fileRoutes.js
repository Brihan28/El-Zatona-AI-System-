const express = require("express");
const router = express.Router();

const { uploadFile } = require("../controllers/fileController");
const upload = require("../middleware/upload");

// POST /api/files/upload
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;