import React, { useState } from "react";
import api from "../api";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    const email = prompt(`Enter your ${provider} email for OTP signup:`);
    if (!email) {
      return;
    }

    try {
      const sendRes = await api.post("/api/auth/social/send-otp", { provider, email });
      alert(sendRes.data);
      if (!sendRes.data.includes("OTP Sent")) {
        return;
      }

      const otp = prompt("Enter the OTP sent to your email:");
      if (!otp) {
        return;
      }

      const verifyRes = await api.post("/api/auth/social/verify-otp", { provider, email, otp });
      alert(verifyRes.data);
      if (verifyRes.data.startsWith("Account created") || verifyRes.data.startsWith("Logged in")) {
        localStorage.setItem("user", email);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data || "Error connecting backend");
    }
  };

  const sendOtp = async () => {
    if (!form.email) {
      alert("Enter email first");
      return;
    }
    try {
      const res = await api.post("/api/auth/send-otp", { email: form.email });
      alert(res.data);
      if (res.data === "OTP Sent") {
        setOtpSent(true);
      }
    } catch (err) {
      alert(err.response?.data || "Error sending OTP");
    }
  };

  const register = async () => {
    if (!otpSent) {
      alert("Send OTP first");
      return;
    }
    try {
      const res = await api.post("/api/auth/verify-otp", form);
      alert(res.data);
      if (res.data === "Registered Successfully") {
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data || "Error registering user");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            value={form.otp}
            onChange={(e) =>
              setForm({ ...form, otp: e.target.value })
            }
          />
          <button onClick={register}>Register</button>
        </>
      )}

      <p className="muted">Or sign in with:</p>
      <div className="btnRow">
        <button className="btnSecondary" onClick={() => handleSocialLogin('google')}>
          Google OTP
        </button>
        <button className="btnSecondary" onClick={() => handleSocialLogin('github')}>
          GitHub OTP
        </button>
      </div>

      <span className="link" onClick={() => navigate("/login")}>
        Already have account? Login
      </span>
    </div>
  );
}

export default Register;