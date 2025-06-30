import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Textinput from '../components/Textinput';
import '../index.css';
import axios from 'axios';


export default function Register() {
   const [name, setName] = useState('');
   const [phone, setPhone] = useState('');
   const [email, setEmail] = useState('');

   function handleSubmit(e) {
      try{
         const res=axios.post("http://localhost:3000/auth/beginRegister");
         console.log('Response:', res.data);
      
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
    }
   }

   function Button() {
      const { pending } = useFormStatus();
      return (
         <button
            disabled={pending}
            type="submit"
            className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-250 transition"
         >
            Get OTP
         </button>
      );
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
               label="Phone"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
            />
            <Textinput
               label="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />

            <Button />
         </form>
      </div>
   );
}
