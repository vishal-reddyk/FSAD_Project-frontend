import React, { useState } from "react";
import api from "../api";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import { isAllowedAdminEmail } from "../utils/adminAccess";

function AdminRegister() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const createAdmin = async () => {
    if (!isAllowedAdminEmail(form.email)) {
      alert("Only the approved admin emails can create admin accounts.");
      return;
    }

    try {
      const res = await api.post("/api/admin/create-admin", form);
      alert(res.data);
      if (res.data.startsWith("Admin")) {
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <h2>Create Admin Account</h2>

      <input
        placeholder="Admin Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Admin Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={createAdmin}>Create Admin</button>

      <span className="link" onClick={() => navigate("/admin")}>Admin Login</span>
    </div>
  );
}

export default AdminRegister;
