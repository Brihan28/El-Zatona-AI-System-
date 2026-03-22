const pdf = require("pdf-parse");

const uploadFile = async (req, res) => {
  try {
    // check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // make sure it's a PDF
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const dataBuffer = req.file.buffer;

    const data = await pdf(dataBuffer);

    res.json({
      message: "PDF processed",
      text: data.text,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile };