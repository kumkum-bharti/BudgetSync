import { useNavigate } from 'react-router-dom';



export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
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
        <div className=" flex items-center justify-center mt-5">
            <button className="flex items-center gap-2 bg-purple-600 text-white text-lg px-10 py-2 rounded-md shadow-md hover:bg-purple-700 transition" onClick= {()=>navigate('/sp')}>Get Started
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
  );
}
