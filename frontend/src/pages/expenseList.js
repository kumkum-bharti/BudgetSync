import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ExpenseList() {
    const location = useLocation();
    const navigate = useNavigate();
    const purchaseId = location.state?.purchaseId;
    const userName = location.state?.userName;
    const purchaseAmount = Number(location.state?.purchaseAmount ?? 0);
    const hasPurchaseAmount = Number.isFinite(purchaseAmount) && purchaseAmount > 0;

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budgetsync-1-3kj3.onrender.com";

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                setLoading(true);
                console.log("expenseList: purchaseId from location state:", purchaseId);
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/sp/getExpenses`, {
                    params: { purchaseId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });
                console.log("expenseList: Response from backend:", res.data);
                setExpenses(res.data.expenses || []);
                setError(null);
            } catch (err) {
                console.error("expenseList: Error fetching expenses:", err.response?.data || err.message);
                setExpenses([]);
            } finally {
                setLoading(false);
            }
        };

        if (purchaseId) {
            fetchExpenses();
        } else {
            console.warn("expenseList: No purchaseId provided!");
        }
    }, [purchaseId]);

    const fetchSummary = async () => {
        try {
            setSummaryLoading(true);
            setSummaryError(null);

            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/sp/getExpenseSummary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });

            setSummary(res.data.summary || 'No summary available.');
        } catch (err) {
            console.error('expenseList: Error generating summary:', err.response?.data || err.message);
            setSummary('');
            setSummaryError(err.response?.data?.message || 'Failed to generate summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    const categoryColors = {
        Food: "bg-orange-100 text-orange-800",
        Transport: "bg-blue-100 text-blue-800",
        Shopping: "bg-pink-100 text-pink-800",
        Utilities: "bg-green-100 text-green-800",
        Health: "bg-red-100 text-red-800",
        Education: "bg-purple-100 text-purple-800",
        Entertainment: "bg-yellow-100 text-yellow-800",
        Rent: "bg-indigo-100 text-indigo-800",
        Other: "bg-gray-100 text-gray-800",
    };

    const totalSpent = expenses.reduce((sum, exp) => sum + (exp.expenseAmount || 0), 0);
    const remaining = hasPurchaseAmount ? purchaseAmount - totalSpent : null;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-purple-900">{userName || 'User'}'s Expenses</h1>
                        <p className="text-gray-600 mt-2">
                            Budget Allocation: {hasPurchaseAmount ? `₹${purchaseAmount.toFixed(2)}` : 'N/A'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchSummary}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
                            disabled={summaryLoading}
                        >
                            {summaryLoading ? 'Generating...' : 'Monthly Summary'}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {(summary || summaryError) && (
                    <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <p className="text-sm font-semibold text-gray-500 mb-2">AI Summary</p>
                        {summaryError ? (
                            <p className="text-red-600">{summaryError}</p>
                        ) : (
                            <p className="text-gray-800 whitespace-pre-line">{summary}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <p className="text-gray-600 text-sm font-semibold">Total Budget</p>
                        <p className="text-3xl font-bold text-purple-600">
                            {hasPurchaseAmount ? `₹${purchaseAmount.toFixed(2)}` : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
                        <p className="text-3xl font-bold text-blue-600">₹{totalSpent.toFixed(2)}</p>
                    </div>
                    <div className={`rounded-lg shadow-md p-6 border-l-4 ${remaining === null ? 'border-gray-400 bg-gray-50' : remaining >= 0 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className={`text-sm font-semibold ${remaining === null ? 'text-gray-700' : remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            Remaining
                        </p>
                        <p className={`text-3xl font-bold ${remaining === null ? 'text-gray-600' : remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {remaining === null ? 'N/A' : `₹${remaining.toFixed(2)}`}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">No expenses added yet</p>
                        <button
                            onClick={() => navigate('/ocr', { state: { purchaseId } })}
                            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Add Expense
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Expenses ({expenses.length})</h2>
                        {expenses.map((expense, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{expense.title || "Untitled"}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Bill #: {expense.BillNumber}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[expense.category] || categoryColors.Other}`}>
                                        {expense.category || "Other"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Amount</p>
                                        <p className="text-lg font-bold text-purple-600">₹{expense.expenseAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Payment</p>
                                        <p className="text-sm text-gray-800">{expense.paymentMode || "Cash"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">GST Number</p>
                                        <p className="text-xs text-gray-800 font-mono">{expense.GSTNumber || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Date</p>
                                        <p className="text-sm text-gray-800">
                                            {expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600">
                                    <p>Person: {expense.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/ocr', { state: { purchaseId } })}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                        Add More Expenses
                    </button>
                </div>
            </div>
        </div>
    );
}