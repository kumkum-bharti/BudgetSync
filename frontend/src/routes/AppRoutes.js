import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";
import Registerf from "../pages/registerf";
import Login from "../pages/login";
import Home from "../pages/home"
import Start from "../pages/start"
import OCR from "../pages/expense"
import SplitPurchase from "../pages/splitPurchase"
import GroupPurchase from "../pages/groupPurchase"
import Analytics from "../pages/analytics"
import ExpenseList from "../pages/expenseList"

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
            <Route path="/expenseList" element={<ExpenseList />} />
            <Route path="/analytics" element={<Analytics />} />

        </Routes>
    );
}

export default AppRoutes;