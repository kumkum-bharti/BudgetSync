import { Routes, Route } from "react-router-dom";
import Register from "../pages/register";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/beginRegister" element={<Register />} />
        </Routes>
    );
}

export default AppRoutes;