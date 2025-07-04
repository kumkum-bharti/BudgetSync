import '../index.css';
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();
    return (
        <div className ="flex items-center  justify-center min-h-screen bg-gray-100">
            <div className="text-center">
            <p className=" text-white bg-black py-4 px-8 text-xl font-semibold rounded-md">HI !! WELCOME TO BUDGETSYNC</p>
            
            <button onClick={() => navigate('/login')}
                className=" mt-10 px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition" >Register</button>
            </div>
        </div>

    );
}



export default Home;
