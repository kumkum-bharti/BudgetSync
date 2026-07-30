import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Start() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [expenseSummary, setExpenseSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budgetsync-1-3kj3.onrender.com";
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://budgetsync-1-3kj3.onrender.com/auth/check", {
          method: "POST",
                headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
          credentials: "include"
        });
        setUser(response.data);
      } catch (err) {
        console.log('User not authenticated');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        

        const res = await axios.get(`${API_BASE_URL}/sp/getExpenseSummary`, {
          headers: {
          Authorization: `Bearer ${token}`
        },
          withCredentials: true,
        });

        setExpenseSummary(res.data.summary || 'No summary available yet.');
      } catch (err) {
        setExpenseSummary('');
        setSummaryError(err.response?.data?.message || 'Unable to load expense summary');
      } finally {
        setSummaryLoading(false);
      }
    };

    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Profile and Logout */}
      <div className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">BudgetSync</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-md hover:bg-purple-200 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">{user.name || 'User'}</span>
                </button>
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <p className="text-sm text-gray-600"><strong>Name:</strong> {user.name}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Email:</strong> {user.email}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Phone:</strong> {user.phone}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Budget <span className="text-purple-500">Sync</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Your budget, simplified — track, save, and grow smarter.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-purple-300 text-white px-5 py-2 rounded-md hover:bg-purple-500 transition">
              Start Tracking
            </button>
            <button className="border border-gray-400 px-5 py-2 rounded-md hover:bg-gray-100 transition">
              View Demo
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-semibold text-green-700">$2.5M+</h3>
              <p className="text-gray-500">Tracked</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-green-700">50K+</h3>
              <p className="text-gray-500">Users</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-green-700">98%</h3>
              <p className="text-gray-500">Accuracy</p>
            </div>
          </div>

          <h2 className="mt-14 text-2xl font-bold text-gray-800">
            Smart Budget Management
          </h2>
          <p className="text-gray-500 mt-2">
            Experience the future of personal finance with our intelligent tracking system.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">Real-time Analytics</h4>
              <p className="text-gray-500 text-sm mt-1">Track your spending with live charts and insights.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">Smart Savings</h4>
              <p className="text-gray-500 text-sm mt-1">AI-powered recommendations to boost savings.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800">Budget Control</h4>
              <p className="text-gray-500 text-sm mt-1">Set limits, get alerts, and stay on track.</p>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-lg border border-purple-100 p-6 text-left">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">AI Expense Summary</h3>
                <p className="text-sm text-gray-500">Visible on your dashboard for a quick monthly check-in.</p>
              </div>
              <button
                onClick={() => {
                  const refresh = async () => {
                    try {
                      setSummaryLoading(true);
                      setSummaryError(null);

                      const res = await axios.get(`${API_BASE_URL}/sp/getExpenseSummary`, {
                        withCredentials: true,
                      });

                      setExpenseSummary(res.data.summary || 'No summary available yet.');
                    } catch (err) {
                      setExpenseSummary('');
                      setSummaryError(err.response?.data?.message || 'Unable to load expense summary');
                    } finally {
                      setSummaryLoading(false);
                    }
                  };

                  refresh();
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
                disabled={summaryLoading}
              >
                {summaryLoading ? 'Loading...' : 'Refresh Summary'}
              </button>
            </div>

            {summaryError ? (
              <p className="text-red-600 text-sm">{summaryError}</p>
            ) : (
              <p className="text-gray-700 whitespace-pre-line leading-7">
                {expenseSummary || 'Your summary will appear here once it is generated.'}
              </p>
            )}
          </div>

          <div className=" flex items-center justify-center mt-5">
            <button className="flex items-center gap-2 bg-purple-600 text-white text-lg px-10 py-2 rounded-md shadow-md hover:bg-purple-700 transition" onClick={() => navigate('/sp')}>Get Started
              <svg
                className="w-6 h-6 "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div >
      </div>
    </div>
  );
}