import React, { useState } from "react";
import api from "../api";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import getApiErrorMessage from "../utils/getApiErrorMessage";

const getApiMessage = (data, fallback) => {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.error === "string" && data.error.trim()) return data.error;
    try {
      return JSON.stringify(data);
    } catch {
      return fallback;
    }
  }

  return fallback;
};

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const promptPasswordSetup = ({ email, provider }) => {
    const shouldSetupPassword = window.confirm(
      `Your ${provider} account was verified.\n\nDo you want to create a password now?`
    );

    if (shouldSetupPassword) {
      navigate("/setup-password", {
        state: {
          email,
          provider,
        },
      });
      return;
    }

    localStorage.setItem("user", email);
    navigate("/dashboard");
  };

  const handleSocialLogin = async (provider) => {
    const email = prompt(`Enter your ${provider} email for OTP signup:`);
    if (!email) {
      return;
    }

    try {
      const sendRes = await api.post("/api/auth/social/send-otp", { provider, email });
      const sendMessage = getApiMessage(sendRes.data, "OTP request completed");
      alert(sendMessage);
      if (!sendMessage.includes("OTP Sent")) {
        return;
      }

      const otp = prompt("Enter the OTP sent to your email:");
      if (!otp) {
        return;
      }

      const verifyRes = await api.post("/api/auth/social/verify-otp", { provider, email, otp });
      const message = getApiMessage(verifyRes.data, "OTP verification completed");
      alert(message);

      if (verifyRes.data?.newUser) {
        promptPasswordSetup({ email, provider });
        return;
      }

      if (typeof message === "string" && (message.startsWith("Account created") || message.startsWith("Logged in"))) {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const sendOtp = async () => {
    if (!form.email) {
      alert("Enter email first");
      return;
    }
    try {
      const res = await api.post("/api/auth/send-otp", { email: form.email });
      const message = getApiMessage(res.data, "OTP request completed");
      alert(message);
      if (message === "OTP Sent") {
        setOtpSent(true);
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const register = async () => {
    if (!otpSent) {
      alert("Send OTP first");
      return;
    }
    try {
      const res = await api.post("/api/auth/verify-otp", form);
      const message = getApiMessage(res.data, "Registration completed");
      alert(message);
      if (message === "Registered Successfully") {
        navigate("/login");
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
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
