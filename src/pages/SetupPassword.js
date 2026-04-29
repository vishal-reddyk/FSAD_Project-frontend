import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../styles/style.css";

function SetupPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const name = location.state?.name;
  const provider = location.state?.provider || "social";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="container">
        <h2>Setup Password</h2>
        <p>No email provided. Please login again.</p>
        <button onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    );
  }

  const handleSetupPassword = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/user/set-password", {
        email,
        password,
      });

      if (response.data.message === "Password set successfully") {
        alert("Password set successfully!");
        localStorage.removeItem("admin");
        localStorage.setItem("user", email);
        navigate("/dashboard");
      } else {
        alert(response.data.message || "Error setting password");
      }
    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Setup Your Password</h2>
      <p>Welcome {name ? `${name}` : ""}! Please set a password for your {provider} account.</p>
      <p style={{ fontSize: "0.9em", color: "#666" }}>Email: {email}</p>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
      />

      <button onClick={handleSetupPassword} disabled={loading}>
        {loading ? "Setting up..." : "Set Password"}
      </button>

      <p className="muted">
        <button
          className="btnLink"
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Back to Login
        </button>
      </p>
    </div>
  );
}

export default SetupPassword;
