import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SplitPurchase = () => {
  const [spAdmin, setspAdmin] = useState([]);
  const [spMember, setspMember] = useState([]);
  const [spName, setSpName] = useState('');
  const [amount, setAmount] = useState(0);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearch, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  let debounceTimer;
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/sp/getSp", {
          withCredentials: true,
        });
        setspAdmin(res.data.spAdmin);
        setspMember(res.data.SPmember);

        const res2 = await axios.get("http://localhost:3000/auth/getUsers", {
          withCredentials: true,
        });
        setMembers(res2.data.users);

      } catch (err) {
        console.error("Error fetching split purchase:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);





  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/sp/addSp", { name: spName, amount, members: selectedMembers }, { withCredentials: true });
      console.log("Response:", res.data);
    }
    catch (err) {
      console.error("Error fetching split purchase:", err.response?.data || err.message);
    }
  }

  const handleSearch = (text) => {
    setSearchTerm(text);
    setSearched(true);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        if (text.trim() === "") {
          setSearchResults([]);
          setSearched(false);
          return;
        }

        const res = await axios.get(`http://localhost:3000/auth/searchUsers?name=${text}`, {
          withCredentials: true,
        });

        setSearchResults(res.data.users);
      }
      catch (err) {

      }
    }, 400);
  }

  const selectMember = (id) => {
    setSelectedMembers(prev => [...prev, id]);
  }


  const selectedMemberNames = useMemo(() => {
    return selectedMembers
      .map(id => members.find(m => m._id === id)?.name)
      .filter(Boolean);
  }, [selectedMembers, members]);


  const handleGroup = (sp, spId) => {
    navigate('/groupPurchase', { state: { spId, sp } });
  };




  return (
    <div className="w-full flex flex-col md:flex-row md:justify-center bg-gray-50 min-h-screen">
      {/* LEFT MAIN SECTION */}
      <div className="w-full md:w-3/4 p-4 sm:p-6 bg-purple-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-purple-800">Split Purchase</h1>

        {/* ADMIN GROUPS */}
        {loading ? (
          <p className="text-center text-gray-600">Loading groups...</p>
        ) : spAdmin.length > 0 ? (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-4">Groups You Created</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spAdmin.map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-xl p-4 shadow-lg border hover:shadow-2xl transition-all duration-300"
                  onClick={() => { handleGroup(group, group._id) }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-600 mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-700">Admin: {group.admin.name}</p>
                  <p className="text-sm text-gray-700">Total Amount: ₹{group.amount}</p>
                  <p className="text-sm text-gray-500">Members: {group.members.length}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-indigo-700">Groups You Created</h2>
            <p className="text-gray-500">No split purchase group yet. <span className="text-indigo-600 font-medium">Make one!</span></p>
          </div>
        )}

        <div className="border-t my-8 sm:my-10 border-gray-300"></div>

        {/* MEMBER GROUPS */}

        {loading ?
          (<p className="text-center text-gray-600">Loading groups...</p>) : (
            spMember.length > 0 ? (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-emerald-700 mb-4">Groups You Are Part Of</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {spMember.map((group) => (
                    <div
                      key={group._id}
                      className="bg-white rounded-xl p-4 shadow-lg border hover:shadow-2xl transition-all duration-300"
                      onClick={() => { handleGroup(group, group._id) }}
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-emerald-600 mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-700">Admin: {group.admin.name}</p>
                      <p className="text-sm text-gray-700">Total Amount: ₹{group.amount}</p>
                      <p className="text-sm text-gray-500">Members: {group.members.length}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-6 sm:mt-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-emerald-700">Groups You Are Part Of</h2>
                You are not part of any split purchase group.
              </div>
            )
          )}
      </div>

      {/* RIGHT SIDEBAR (Form) */}
      <div className="w-full md:w-1/4 px-4 sm:px-6 pt-6 pb-10 bg-white">
        <h2 className="text-center text-lg sm:text-xl font-bold text-blue-500 mb-6">Create Your Own Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={spName}
            onChange={(e) => setSpName(e.target.value)}
            placeholder="Group Name"
            className="w-full p-2 border rounded-md text-sm sm:text-base"
            required
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Total Amount"
            className="w-full p-2 border rounded-md text-sm sm:text-base"
            required
          />

          <input
            type="text"
            value={selectedMemberNames.join(', ')}
            placeholder="Members"
            readOnly
            className="w-full p-2 border rounded-md text-sm sm:text-base bg-gray-100"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 border rounded-md mb-2 text-sm sm:text-base"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(isSearch ? searchResults : members).map((user) => (
              <div
                key={user._id}
                className="bg-gray-100 rounded-lg p-2 sm:p-3 text-center shadow cursor-pointer hover:bg-indigo-100"
                onClick={() => selectMember(user._id)}
              >
                <p className="text-sm sm:text-base font-medium text-indigo-700">{user.name}</p>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white font-semibold py-2 rounded-md hover:bg-purple-800 transition text-sm sm:text-base"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>

  );
}

export default SplitPurchase;