import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Textinput from '../components/Textinput';
import '../index.css';
import axios from 'axios';


export default function Register() {
   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [email, setEmail] = useState('');

   const navigate = useNavigate();

   const data={
      name:name,
      phone:phone,
      email:email
   }

   const isDisabled = !name || !phone || !email;

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await axios.post("http://localhost:3000/auth/beginRegister",
            { name, phone, email });
         navigate('/Register', { state:data})
         console.log('Response:', res.data);

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
               label="Name"
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <Textinput
               type='tel'
               label="Phone"
               value={phone}
               pattern="[0-9]{4,10}"
               onChange={(e) => setPhone(e.target.value)}
            />
            <Textinput
               type='email'
               label="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />

            <button
               disabled={isDisabled}
               type="submit"
               className={`w-full py-2 rounded transition 
                     ${isDisabled ? 'bg-purple-300 text-white cursor-not-allowed'
                     : 'bg-purple-500 text-white hover:bg-purple-400'}`}
            >
               Get OTP
            </button>

         </form>
      </div>
   );
}
