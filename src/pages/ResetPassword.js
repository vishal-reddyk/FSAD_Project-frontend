import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import "../styles/style.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/user/reset-password-request", { email });

      if (response.status === 200) {
        alert("✅ If an account exists with this email, a reset code has been generated.");
        setStep(2);
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/user/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.data.message === "Password reset successfully") {
        alert("✅ Password reset successfully!");
        navigate("/login");
      } else {
        alert("❌ " + response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>

      {step === 1 ? (
        <>
          <p>Enter your email address to reset your password</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleRequestReset} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </>
      ) : (
        <>
          <p>Enter the OTP and your new password for: {email}</p>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <button
            className="btnSecondary"
            onClick={() => {
              setStep(1);
              setEmail("");
              setOtp("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            style={{ marginTop: "10px" }}
          >
            Back
          </button>
        </>
      )}

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

export default ResetPassword;
