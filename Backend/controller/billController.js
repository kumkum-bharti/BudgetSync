const { extractTextFromBill } = require('../utils/googleVision');

const billUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;
    console.log('Bill upload started for:', imagePath);

    const billData = await extractTextFromBill(imagePath);
    console.log('Bill upload successful');
    return res.status(200).json({ billData });
  } catch (err) {
    console.error('Bill upload error:', err.message);
    console.error('Stack:', err.stack);
    return res.status(500).json({
      error: "Bill extraction failed",
      details: err.message,
      message: `Failed to extract bill data: ${err.message}`
    });
  }
}

module.exports = { billUpload };