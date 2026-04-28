import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Recommendations from "./pages/Recommendations";
import RecommendationDetail from "./pages/RecommendationDetail";
import EditRecommendation from "./pages/EditRecommendation";
import UserLogin from "./pages/UserLogin";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import SetupPassword from "./pages/SetupPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/setup-password" element={<SetupPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/recommendation/:id" element={<RecommendationDetail />} />
        <Route path="/recommendation/:id/edit" element={<EditRecommendation />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;