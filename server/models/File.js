const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // ✅ IMPORTANT
  },

  filename: String,
  fileData: Buffer, // 🔥 STORE PDF
  contentType: String,
  summary: String,

  quiz: [
    {
      question: String,
      options: [String],
      answer: String,
      topic: String,
    },
  ],

  attempts: [
    {
      answers: [String],
      score: Number,
      weak: Boolean,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", FileSchema);