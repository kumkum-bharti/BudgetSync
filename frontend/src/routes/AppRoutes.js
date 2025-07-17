import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Registerf from "../pages/registerf";
import Login from "../pages/login";
import Home from "../pages/home"
import Start from "../pages/start"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/beginRegister" element={<Register />} />
            <Route path="/Register" element={<Registerf />} />
            <Route path="/login" element={<Login />} />
            <Route path="/start" element={<Start />} />

        </Routes>
    );
}

export default AppRoutes;