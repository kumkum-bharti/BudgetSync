import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function GroupPurchase() {
  const location = useLocation();
  const sendSpId = location.state?.spId;
  const sendSp = location.state?.sp;
 
  const members=sendSp.members;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Sending spId:", sendSpId);

        const res = await axios.get("http://localhost:3000/sp/getPurchases", {
          params: { spId: sendSpId },
          withCredentials: true,
        });

        setPurchases(res.data);
        
        const purchaseMembers=purchases.map(purchase=> purchase.userId.toString());
        const restPurchases=members.filter(id=> (purchaseMembers.includes(id.toString())));
        console.log("dfhf",restPurchases);


      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sendSpId) {
      fetchData();
    }
  }, [sendSpId]);

 

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-center bg-gray-50 min-h-screen">

    {/* LEFT MAIN SECTION */}    
    <div className="w-full md:w-3/4 p-4 sm:p-6 bg-purple-100">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        Group Purchases
      </h2>

      {loading && <p className="text-center text-gray-500">Loading purchases...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
      {purchases.length > 0 ?
        purchases.map((purchase, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-[#2F2F2F]">
                {purchase.userID?.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              Total Amount: ₹{purchase.amount}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Rest Amount: ₹{purchase.restAmount}
            </p>
          </div>
        ))
      :(
      <p className="text-center text-gray-500 mt-6">No purchases found.</p>)
}
      </div>   
    </div>

    
    {/* RIGHT SIDEBAR (Form) */}
    <div className="w-full md:w-1/4 px-4 sm:px-6 pt-6 pb-10 bg-white">
    
    </div>
    </div>
  );

}
