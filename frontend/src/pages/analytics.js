import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8B5CF6', '#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#EF4444', '#6366F1'];

export default function Analytics() {
    const location = useLocation();
    const spId = location.state?.spId;
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budgetsync-1-3kj3.onrender.com";
    
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); // Retrieve token from localStorage

                const res = await axios.get(`${API_BASE_URL}/sp/getAnalytics`, {
                    params: { spId },
                    headers: {
                        Authorization: `Bearer ${token}` // Pass the Bearer token here
                    },
                    withCredentials: true
                });
                setAnalytics(res.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch analytics');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (spId) {
            fetchAnalytics();
        }
    }, [spId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
    }

    if (!analytics) {
        return <div className="flex justify-center items-center h-screen">No analytics data available</div>;
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-purple-900 mb-2">{analytics.groupName}</h1>
                <p className="text-center text-gray-600 mb-8">Analytics Dashboard</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
                        <p className="text-gray-600 text-sm font-semibold">Total Budget</p>
                        <p className="text-3xl font-bold text-purple-600">₹{analytics.totalBudget.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                        <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
                        <p className="text-3xl font-bold text-blue-600">₹{analytics.totalSpent.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
                        <p className="text-gray-600 text-sm font-semibold">Remaining</p>
                        <p className="text-3xl font-bold text-green-600">₹{analytics.remainingBudget.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
                        <p className="text-gray-600 text-sm font-semibold">Budget Used</p>
                        <p className="text-3xl font-bold text-orange-600">{analytics.spendPercentage.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-purple-900 mb-6">Expense Category Breakdown</h2>
                        {analytics.categoryBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name} ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analytics.categoryBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500">No category data available</p>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-purple-900 mb-6">User Contributions</h2>
                        {analytics.userContribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.userContribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                    <Bar dataKey="amount" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-gray-500">No user data available</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-purple-900 mb-6">Category Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.categoryBreakdown.map((category, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border-l-4 border-purple-500">
                                <p className="font-semibold text-gray-800">{category.name}</p>
                                <p className="text-xl font-bold text-purple-600">₹{category.value.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">{category.percentage.toFixed(1)}% of total</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}