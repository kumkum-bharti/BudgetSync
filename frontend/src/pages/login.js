import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Textinput from '../components/Textinput';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isDisabled = !email || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password }, {
        withCredentials: true
      });

      console.log('Response:', res.data);
      navigate('/start');
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-purple-400 min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-xl overflow-hidden max-w-4xl w-full ">

        {/* Left Side Image */}


        {/* Right Side Form */}
        <motion.div
          className="w-full md:w-1/2 p-8 space-y-6 bg-purple-300"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-white">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Textinput
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">Enter Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full py-2 rounded transition font-semibold
                ${isDisabled
                  ? 'bg-purple-300 text-white cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-500'
                }`}
            >
              Login
            </button>
          </form>

          <button
            onClick={() => navigate('/beginRegister')}
            className="w-full py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition"
          >
            Sign Up
          </button>
        </motion.div>

        <div className="hidden md:block md:w-1/2">
          <img
            src="https://ouch-prod-var-cdn.icons8.com/tv/illustrations/thumbs/nXIr3HsqDNFB0XDx.webp"
            alt="Login visual"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
