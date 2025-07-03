import { useState } from 'react';
import Textinput from '../components/Textinput';
import '../index.css';
import axios from 'axios';


export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');


   const isDisabled = !email || !password;

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post("http://localhost:3000/auth/login",
            { email, password });
         console.log('Response:', res.data);
         alert("Login Success");

      } catch (err) {
         console.error('Error submitting form:', err.response?.data || err.message);
      }
   }



   return (
      <div className="bg-gradient-to-r from-pink-200 to-purple-400 min-h-screen flex items-center justify-center">
         <form
            onSubmit={handleSubmit}
            className="  space-y-4 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto "
         >
            <Textinput
               type='email'
               label="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />

            <Textinput
               type='password'
               label="Enter correct password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />



            <button
               disabled={isDisabled}
               type="Login"
               className={`w-full py-2 rounded transition 
                     ${isDisabled ? 'bg-purple-300 text-white cursor-not-allowed'
                     : 'bg-purple-500 text-white hover:bg-purple-400'}`}
            >
               Login
            </button>

         </form>
      </div>
   );
}
