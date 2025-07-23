import { useState,useEffect } from 'react';
import axios from 'axios';


const SplitPurchase = () => {
  const[spAdmin,setspAdmin]=useState([]);
  const[spMember,setspMember]=useState([]);
  const[spName,setSpName]=useState();
  const[amount,setAmount]=useState();
  const[members,setMembers]=useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/sp/getSp", {
          withCredentials: true,
        });
        console.log("Response:", res.data);
        setspAdmin(res.data.spAdmin);
        setspMember(res.data.SPmember);

        const res2=await axios.get("http://localhost:3000/auth/getUsers", {
          withCredentials: true,
        });
        console.log("Response2:", res2.data);
        setMembers(res2.data.users);
        
      } catch (err) {
        console.error("Error fetching split purchase:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

 

  

  const handleSubmit=async(res,req)=>{
     try{
       const res=await axios.post("http://localhost:3000/sp/addSp",{withCredentials:true},{spName,amount,members});
       console.log("Response:", res.data);
     }
     catch(err){
          console.error("Error fetching split purchase:", err.response?.data || err.message);
     }
  }

  return (
  <div className="w-full flex justfy-center bg-gray-50 min-h-screen">
    <div className="w-3/4 p-6 bg-gray-300">
      <h1 className="text-3xl font-bold mb-10 text-center text-purple-800">Split Purchase</h1>

      {/* Admin Groups */}
      {spAdmin.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Groups You Created</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spAdmin.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-xl p-5 shadow-lg border hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-700">Total Amount: ₹{group.amount}</p>
                <p className="text-sm text-gray-500">Members: {group.members.length}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center mt-8">
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">Groups You Created</h2>
          <p className="text-gray-500">You have not created any split purchase group. <span className="text-indigo-600 font-medium">Make one!</span></p>
        </div>
      )}

      {/* Separator */}
      <div className="border-t my-10 border-gray-300"></div>

      {/* Member Groups */}
      {spMember.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Groups You Are Part Of</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spMember.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-xl p-5 shadow-lg border hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-emerald-600 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-700">Admin: {group.admin.name}</p>
                <p className="text-sm text-gray-700">Total Amount: ₹{group.amount}</p>
                <p className="text-sm text-gray-500">Members: {group.members.length}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <h2 className="text-xl font-semibold mb-2 text-emerald-700">Groups You Are Part Of</h2>
          You are not part of any split purchase group.
        </div>
      )}
    </div>
    <div className="w-1/4" >
        <h2 className="text-center text-xl mt-5 font-bold text-blue-300  ">CREATE YOUR OWN GROUP</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={spName}
          onChange={(e) => setSpName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Total Amount"
          className="w-full p-2 border rounded-md"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {members.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl p-5 shadow-lg border hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">{member.name}</h3>
              </div>
            ))}
           </div> 
         

        <button
          type="submit"
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-800 transition"
        >
          Create Group
        </button>
      </form>
    </div>
  </div>
);
}

export default SplitPurchase;