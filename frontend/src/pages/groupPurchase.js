import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function GroupPurchase() {
  const location = useLocation();
  const navigate = useNavigate();
  const sendSpId = location.state?.spId;
  const sendSp = location.state?.sp;
  const role = location.state?.role;

  const members = sendSp.members;

  const [purchases, setPurchases] = useState([]);
  const [restPurchases, setRestPurchases] = useState([]);
  const [newPurchase, setNewPurchase] = useState('');
  const [newPurchaseId, setNewPurchaseId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:3000/sp/getPurchases", {
          params: { spId: sendSpId },
          withCredentials: true,
        });
        setPurchases(res.data);
      }
      catch (err) {
        console.log("Error: No purchases made yet");
      }
      finally {
        setLoading(false);
      }
    };

    if (sendSpId) {
      fetchData();
    }
  }, [sendSpId]);

  useEffect(() => {
    const purchaseMembers = purchases.map(purchase => purchase.userID?._id?.toString());

    const updatedRest = members.filter(member => {
      const memberId = member._id?.toString();
      return !purchaseMembers.includes(memberId);
    });

    setRestPurchases(updatedRest);
  }, [purchases, members]);

  const handleViewExpenses = (purchase) => {
    console.log("groupPurchase: Clicking on purchase:", purchase._id, purchase.userID?.name);
    navigate('/expenseList', {
      state: {
        purchaseId: purchase._id,
        userName: purchase.userID?.name,
        purchaseAmount: purchase.amount
      }
    });
  };

  const addNewPurchase = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/sp/addPurchase", { userID: newPurchaseId, amount: amount, splitPurchaseId: sendSpId }, { withCredentials: true });
      console.log("Response:", res.data);
      setPurchases(prev => [...prev, res.data]);
    }
    catch (err) {
      console.error("Error fetching split purchase:", err.response?.data || err.message);
      alert("Only admins are allowed to create new purchase")
    }
  }

  const setNewPurchaseData = (restPurchase) => {
    setNewPurchase(restPurchase.name)
    setNewPurchaseId(restPurchase._id)
  }

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-center bg-gray-50 min-h-screen">

      {/* LEFT MAIN SECTION */}
      <div className="w-full md:w-3/4 p-4 sm:p-6 bg-purple-100">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          {sendSp.name} Purchases
        </h2>

        <h3>
          <h4>Admin:{sendSp.admin.name}</h4>
          <h4>Amount:{sendSp.amount}</h4>
          <h4>Remaining Amount:{sendSp.restAmount}</h4>
        </h3>

        {loading && <p className="text-center text-gray-500">Loading purchases...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {purchases.length > 0 ?
            purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => { handleViewExpenses(purchase) }}
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
            : (
              <p className="text-center text-gray-500 mt-6">No purchases found.</p>)
          }
        </div>
      </div>


      {/* RIGHT SIDEBAR (Form) */}
      {role ? (
        <div className="w-full md:w-1/4 px-4 sm:px-6 pt-6 pb-10 bg-white">
          <h2 className="text-center text-lg sm:text-xl font-bold text-blue-500 mb-6">Add new purchase to the Group</h2>

          <form onSubmit={addNewPurchase} className="space-y-4">

            <select
              value={newPurchaseId}
              onChange={(e) => {
                const selected = restPurchases.find(member => member._id === e.target.value);
                setNewPurchaseData(selected);
              }}
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              required
            >
              <option value="">Select a member</option>
              {restPurchases.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>


            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Total Amount"
              className="w-full p-2 border rounded-md text-sm sm:text-base"
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-800 transition text-sm sm:text-base"
            >
              Create Purchase
            </button>
          </form>


        </div>) : (
        <div className="w-full md:w-1/4 px-4 sm:px-6 pt-6 pb-10 bg-purple-100">
        </div>

      )
      }
    </div>

  );

}
