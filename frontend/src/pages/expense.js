import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ExpenseForm({ ocrData, onClose, purchaseId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navPurchaseId = location.state?.purchaseId;
  const finalPurchaseId = purchaseId || navPurchaseId || "687b895ffd3e12c36348abdb";
  const [userName, setUserName] = useState(ocrData?.name || "");
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budgetsync-1-3kj3.onrender.com";

  console.log("ExpenseForm initialized with purchaseId:", finalPurchaseId);

  const [formData, setFormData] = useState({
    name: ocrData?.name || "",
    title: ocrData?.merchant || ocrData?.title || "",
    expenseAmount: ocrData?.expenseAmount ?? 0,
    category: ocrData?.category || 'Other',
    paymentMode: ocrData?.paymentMode || 'Cash',
    GSTNumber: ocrData?.GSTNumber || "",
    BillNumber: ocrData?.BillNumber || "",
    purchaseId: finalPurchaseId
  });

  const requiredFields = ['name', 'title', 'expenseAmount', 'GSTNumber', 'BillNumber'];
  const isFakeBill = requiredFields.some(field => !formData[field]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/auth/check`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        if (response.data?.name) {
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error('Unable to fetch logged-in user:', error.response?.data || error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setFormData({
      name: userName || ocrData?.name || "",
      title: ocrData?.merchant || ocrData?.title || "",
      expenseAmount: ocrData?.expenseAmount ?? 0,
      category: ocrData?.category || 'Other',
      paymentMode: ocrData?.paymentMode || 'Cash',
      GSTNumber: ocrData?.GSTNumber || "",
      BillNumber: ocrData?.BillNumber || "",
      purchaseId: finalPurchaseId
    });
  }, [ocrData, finalPurchaseId, userName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFakeBill) return alert("This bill seems fake. Missing required fields.");

    try {
      console.log("Submitting expense with data:", formData);
      const convertedData = {
        ...formData,
        expenseAmount: parseFloat(formData.expenseAmount)
      };
      console.log("Converted data:", convertedData);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/sp/addExpense`, convertedData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log("Success response:", response.data);
      alert("Expense successfully added!");
      if (navPurchaseId) {
        navigate('/expenseList', { state: { purchaseId: navPurchaseId } });
      } else {
        navigate('/start');
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert(`Error submitting expense: ${errorMsg}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg space-y-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Submit Expense</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {requiredFields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field === "expenseAmount" ? "number" : "text"}
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
  const [data, setData] = useState(null);
  const [ocrError, setOcrError] = useState(null);

  const API_BASE_URL = "https://budgetsync-1-3kj3.onrender.com";

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setOcrError(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      setOcrError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      console.log("Starting OCR upload...");
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("OCR response:", res.data);
      setData(res.data.billData || null);
      setOcrError(null);
    } catch (err) {
      console.error("Error during OCR:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.details || err.message || "Unknown error";
      setOcrError(`OCR Error: ${errorMsg}`);
      alert(`OCR Error: ${errorMsg}`);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-center bg-gray-50 min-h-screen">
      {/*right section - main OCR uploader*/}
      <div className="w-full md:w-3/4 px-4 sm:px-6 pt-6 pb-10 bg-white">
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

            {ocrError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {ocrError}
              </div>
            )}

            {data && (
              <pre className="mt-6 p-4 bg-[#FEE1B6] rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>

          {data && (
            <div className="w-full max-w-2xl mt-10">
              <ExpenseForm ocrData={data} onClose={() => setData(null)} />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}