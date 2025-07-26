import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Registerf from "../pages/registerf";
import Login from "../pages/login";
import Home from "../pages/home"
import Start from "../pages/start"
import OCR from "../pages/ocr"
import SplitPurchase from "../pages/splitPurchase"
import GroupPurchase from "../pages/groupPurchase"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/beginRegister" element={<Register />} />
            <Route path="/Register" element={<Registerf />} />
            <Route path="/login" element={<Login />} />
            <Route path="/start" element={<Start />} />
            <Route path="/ocr" element={<OCR />} />
            <Route path="/sp" element={<SplitPurchase />} />
            <Route path="/groupPurchase" element={<GroupPurchase />} />

        </Routes>
    );
}

export default AppRoutes;