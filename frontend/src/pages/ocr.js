import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




function parseBillText(text) {
  const data = {};

  text = text.replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^ -~\n]+/g, '')
    .replace(/₹/g, 'Rs');



  const patterns = {
    name: [/Name[:\s]+([A-Za-z\s]+)(?:\s*\(.*\))?/, /Customer[:\s]+([A-Za-z\s]+)/],
    GSTNumber: [/GSTIN[:\s]*([0-9A-Z]{15})/, /GST\s*No\.?:?\s*([0-9A-Z]{15})/],
    date: [/Date[:\s]*([\d\-\/: ]+)/, /Dated[:\s]*([\d\-\/: ]+)/],
    time: [/(\d{2}:\d{2}(?::\d{2})?)/],
    expenseAmount: [
      /Grand\s+Total[^₹\d]*([₹Rs]?[0-9,.]+)/i,
      /Total[:\s₹]*([0-9]+(?:\.[0-9]+)?)/i
    ],
    paymentMode: [/Paid by[:\s]+(Cash|Card|UPI|Bank Transfer)/i],
  };


  for (const key in patterns) {
    for (const regex of patterns[key]) {
      const match = text.match(regex);
      if (match) {
        data[key] = match[1].trim();
        break;
      }
    }
  }

  const billNumberPatterns = [
    /Bill\s*No[:.\s]*#?\s*(\d+)/i,
    /Bill\s*Number[:.\s]*#?\s*(\d+)/i,
    /Bill\s*No\.?\s*(\d+)/i,
    /\bNo\.?\s*[:#]?\s*(\d{3,6})\b/i
  ];

  for (const pattern of billNumberPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.BillNumber = match[1];
      break;
    }
  }


  const phoneMatch = text.match(/(?:Phone|Mob|Contact)[:\s]*([6-9]\d{9})/);
  if (phoneMatch) data.phone = phoneMatch[1];


  const firstLine = text.split('\n').find(line => line.trim().length > 0);
  if (firstLine && !data.businessName) data.title = firstLine.trim();


  return data;
}

function ExpenseForm({ ocrData }) {
  const navigate = useNavigate();
  const rawpurchaseId = "687b895ffd3e12c36348abdb".trim();
  console.log("purchaseId Length:", rawpurchaseId.length);  

  const [formData, setFormData] = useState({
    ...ocrData,
    category: 'Other',
    paymentMode: 'Cash',
    purchaseId: rawpurchaseId
  });

  const requiredFields = ['name', 'title', 'expenseAmount', 'GSTNumber', 'BillNumber'];
  const isFakeBill = requiredFields.some(field => !ocrData[field]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFakeBill) return alert("This bill seems fake. Missing required fields.");

    try {
      console.log("Sending purchaseId:", formData.purchaseId);
      await axios.post("http://localhost:3000/sp/addExpense", formData, { withCredentials: true });
      alert("Expense successfully added!");
      navigate('/start');
    } catch (error) {
      console.error(error.response.data);
      alert("Error submitting expense.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Submit Expense</h2>

        {requiredFields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field === "expenseAmount" ? "number" : "text"}
              value={formData[field] || ""}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
            />
          </div>
        ))}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {['Food', 'Transport', 'Shopping', 'Utilities', 'Health', 'Education', 'Entertainment', 'Rent', 'Other']
              .map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other']
              .map((mode) => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </div>

        {isFakeBill && (
          <p className="text-red-600 font-semibold">
            ⚠️ Missing required fields. This might be a fake bill.
          </p>
        )}

        <button
          type="submit"
          disabled={isFakeBill}
          className={`w-full py-2 px-4 text-white font-bold rounded-md ${isFakeBill ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}


export default function OCR() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [data, setData] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, { withCredentials: true, });
      setText(res.data.text);
      setData(parseBillText(res.data.text));
    } catch (err) {
      console.error("Error during OCR:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEDEF6] text-[#2F2F2F] flex flex-col items-center px-6 py-12">
      <h2 className="text-3xl font-bold mb-6 text-[#2F2F2F]">🧾 Bill OCR Extractor</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Bill Image
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#CCE5E3] hover:bg-[#aad2cf] text-[#2F2F2F] font-semibold py-2 px-4 rounded-lg transition"
        >
          Extract Data
        </button>

        {text && (
          <pre className="mt-6 p-4 bg-[#FEE1B6] rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>

      {data && (
        <div className="w-full max-w-2xl mt-10">
          <ExpenseForm ocrData={data} />
        </div>
      )}
    </div>
  );

}


