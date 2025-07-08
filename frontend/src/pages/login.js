import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Textinput from '../components/Textinput';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const isDisabled = !email || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password });
      console.log('Response:', res.data);
      alert("Login Success");
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-300 to-purple-500 min-h-screen flex items-center justify-center px-4">
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

            <Textinput
              type="password"
              label="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
