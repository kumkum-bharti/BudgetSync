import { useState } from 'react';
import {useLocation} from 'react-router-dom';
import Textinput from '../components/Textinput';
import '../index.css';
import axios from 'axios';


export default function Register() {
   const [verifynum, setNum] = useState('');

   const email=useLocation().state;
  
   

   const isDisabled = !verifynum ;

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post("http://localhost:3000/auth/verify",
            { verifynum,email });
         console.log('Response:', res.data);
         if(res)
            alert("Correct OTP")
        else
            alert("Wrong OTP")

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
               label="Enter OTP"
               value={verifynum}
               onChange={(e) => setNum(e.target.value)}
            />
        

            <button
               disabled={isDisabled}
               type="Register"
               className={`w-full py-2 rounded transition 
                     ${isDisabled ? 'bg-purple-300 text-white cursor-not-allowed'
                     : 'bg-purple-500 text-white hover:bg-purple-400'}`}
            >
               Verify OTP
            </button>

         </form>


      </div>
   );
}
