import React, { useState } from "react";
import api from "../api";
import Captcha from "../components/Captcha";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import { isAllowedAdminEmail, normalizeAdminEmail } from "../utils/adminAccess";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaOk, setCaptchaOk] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!captchaOk) {
      alert("Verify captcha first");
      return;
    }

    if (!isAllowedAdminEmail(form.email)) {
      alert("Only the allowed admin accounts can access the admin dashboard.");
      return;
    }

    try {
      const res = await api.post("/api/admin/login", form);
      alert(res.data);
      if (res.data === "Admin Login Success") {
        localStorage.removeItem("user");
        localStorage.setItem("admin", normalizeAdminEmail(form.email));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Captcha onVerify={setCaptchaOk} />

      <button onClick={login}>Login</button>

      <span className="link" onClick={() => navigate("/admin-register")}>Create Admin Account</span>
      <span className="link" onClick={() => navigate("/login")}>
        User Login
      </span>
    </div>
  );
}

export default AdminLogin;