import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Registerf from "../pages/registerf";
import Login from "../pages/login";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/beginRegister" element={<Register />} />
            <Route path="/Register" element={<Registerf />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AppRoutes;