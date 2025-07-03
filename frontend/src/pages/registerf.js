import { useState } from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import Textinput from '../components/Textinput';
import '../index.css';
import axios from 'axios';



export default function Register() {
   const [verifynum, setNum] = useState('');
   const [verify,setVerify]=useState(false);
   const [password,setPassword]=useState('');
   
   const {name,phone,email}=useLocation().state;

  const navigate=useNavigate();

   const isDisabled = !verifynum ;
   const isPassword=!password;

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         if(verify){
            const res=await axios.post("http://localhost:3000/auth/register",
                                    {name,phone,email,password});
            console.log('Response',res.data);
            alert("Registered Successfully!");
            navigate('/login')
        }
        else{
         const res = await axios.post("http://localhost:3000/auth/verify",
                                      { verifynum,email });
         console.log( res.data);
         const flag=res.data;
         console.log(flag)
         if(flag){
            alert("Correct OTP")
            setVerify(true);
         }
         else
            alert("Wrong OTP")                         

         }
      }

   catch (err) {
         console.error('Error submitting form:', err.response?.data || err.message);
      }
   
   }



   return (
      <div className="bg-gradient-to-r from-pink-200 to-purple-400 min-h-screen flex items-center justify-center">
         <form
            onSubmit={handleSubmit}
            className="  space-y-4 bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto "
         >
            {!verify && (<Textinput
               label="Enter OTP"
               value={verifynum}
               onChange={(e) => setNum(e.target.value)}
            />)}

            {verify && (
             <div> 
             <p className=" text-white-400 ">Create Password for the account.</p>
            <Textinput
               type="password"
               label=""
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
            </div> 
         )}



            <button
               disabled={verify? isPassword :isDisabled}
               type="Register"
               className={`w-full py-2 rounded transition 
                     ${(verify? isPassword :isDisabled) ? 'bg-purple-300 text-white cursor-not-allowed'
                     : 'bg-purple-500 text-white hover:bg-purple-400'}`}
            >
               {verify? 'Register' : 'Verify OTP' }
            </button>

         </form>


      </div>
   );
}
