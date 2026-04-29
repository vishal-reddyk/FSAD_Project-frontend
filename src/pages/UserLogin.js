import React, { useState } from "react";
import api from "../api";
import Captcha from "../components/Captcha";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import getApiErrorMessage from "../utils/getApiErrorMessage";
import SocialLogin from "../components/SocialLogin"

function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaOk, setCaptchaOk] = useState(false);
  const navigate = useNavigate();

  const promptPasswordSetup = ({ email, provider }) => {
    const shouldSetupPassword = window.confirm(
      `This is your first ${provider} login.\n\nDo you want to create a password now?`
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
    const email = prompt(`Enter your ${provider} email for OTP login:`);
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
      alert(verifyRes.data.message || verifyRes.data);

      if (verifyRes.data.newUser) {
        promptPasswordSetup({ email, provider });
        return;
      }

      if (!verifyRes.data.newUser) {
        localStorage.setItem("user", email);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    }
  };

  const login = async () => {
    if (!captchaOk) {
      alert("Verify captcha first");
      return;
    }

    try {
      const res = await api.post("/api/user/login", form);

      if (res.data === "User Login Success") {
        alert("Login Success ✅");

        // ✅ store login session
        localStorage.removeItem("admin");
        localStorage.setItem("user", form.email);

        // ✅ redirect to dashboard
        navigate("/dashboard");

      } else {
        alert("Invalid Credentials ❌");
      }

    } catch (err) {
      console.error(err);
      alert(getApiErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <h2>User Login</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <Captcha onVerify={setCaptchaOk} />

      <button onClick={login}>Login</button>

      <span className="link" onClick={() => navigate("/reset-password")} style={{ marginTop: "10px", display: "block", textAlign: "center" }}>
        🔒 Forgot Password?
      </span>

      <p className="muted">Or sign in with:</p>
      <div className="btnRow">
        <button className="btnSecondary" onClick={() => handleSocialLogin('google')}>
          Google OTP
        </button>
        <button className="btnSecondary" onClick={() => handleSocialLogin('github')}>
          GitHub OTP
        </button>
      </div>
      <SocialLogin />

      <span className="link" onClick={() => navigate("/register")}>
        New user? Register
      </span>

      <span className="link" onClick={() => navigate("/admin")}>
        Admin Login
      </span>
    </div>
  );
}

export default UserLogin;