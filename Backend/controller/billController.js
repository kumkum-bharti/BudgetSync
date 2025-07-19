const Tesseract=require("tesseract.js");

const billUpload=async(req,res) =>{  
   const imagePath=req.file.path;
    

  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");    
    console.log(text);
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "OCR failed", details: err.message });
  }
}

module.exports={billUpload};