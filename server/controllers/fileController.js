const pdf = require("pdf-parse");
const { summarizeText } = require("../services/aiService");
const { generateQuiz } = require("../services/quizService");
const File = require("../models/File");

// =======================
// 📄 UPLOAD FILE
// =======================
const uploadFile = async (req, res) => {
  try {
    console.log("UPLOAD HIT");

    // 1️⃣ Check file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 DEBUG: multer buffer
    console.log("BUFFER SIZE:", req.file?.buffer?.length);

    // 2️⃣ Validate type
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    // 3️⃣ Parse PDF
    const data = await pdf(req.file.buffer);

    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ error: "No text found in PDF" });
    }

    // 4️⃣ Limit text
    const extractedText = data.text.trim();

    // 4️⃣ Limit text for AI pipeline
    const textToSummarize = extractedText.substring(0, 2000);

    // 5️⃣ AI Summary
    const summary = await summarizeText(textToSummarize);

    // 6️⃣ AI Quiz
    const quizRaw = await generateQuiz(summary);
    const quiz = JSON.parse(quizRaw);

    // 7️⃣ Save to DB
    const savedFile = await File.create({
      user: req.user,
      filename: req.file.originalname,
      fileData: req.file.buffer,
      contentType: req.file.mimetype,
      summary,
      quiz,
      extractedText,
    });

    // 🔥 DEBUG: after DB save
    console.log("DB FILE SIZE:", savedFile.fileData?.length);

    // 8️⃣ Response
    res.json({
      message: "PDF processed successfully",
      fileId: savedFile._id,
      summary,
      quiz,
      extractedText,
    });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      error: "Something went wrong while processing PDF",
    });
  }
};

// =======================
// 📂 GET USER FILES
// =======================
const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user })
      .select("filename summary extractedText quiz attempts uploadedAt contentType")
      .sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// =======================
// 👁 VIEW FILE (FIXED 🔥)
// =======================
const getFileById = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // 🔥 IMPORTANT HEADERS
    res.set({
      "Content-Type": file.contentType || "application/pdf",
      "Content-Disposition": "inline; filename=" + file.filename,
      "Content-Length": file.fileData.length,
    });

    res.send(file.fileData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// =======================
// 🗑 DELETE FILE
// =======================
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    res.json({ msg: "File deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getFileDetails = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user,
    }).select("filename extractedText summary uploadedAt");

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  uploadFile,
  getUserFiles,
  getFileById,
  getFileDetails,
  deleteFile,
};