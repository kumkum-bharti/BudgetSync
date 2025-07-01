import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Registerf from "../pages/registerf";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/beginRegister" element={<Register />} />
            <Route path="/Register" element={<Registerf />} />
        </Routes>
    );
}

export default AppRoutes;