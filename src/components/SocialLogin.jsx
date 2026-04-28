import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { auth } from "../services/firebase";
import api from "../api";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export default function SocialLogin() {
  const navigate = useNavigate();

  const handleSocialLogin = async (provider, providerName) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      console.log(`${providerName} User:`, user);
      console.log(`${providerName} ID token:`, token);

      const response = await api.post("/api/user/firebase-login", { idToken: token });
      console.log("Backend response:", response.data);

      const responseData = response.data;
      const isNewUser = responseData?.isNewUser || false;
      const email = responseData?.email || "";
      const name = responseData?.name || "";
      const providerValue = responseData?.provider || "";

      if (response.status === 200) {
        localStorage.removeItem("admin");

        if (isNewUser) {
          // ✅ New user - redirect to setup password page
          alert(`Welcome! Please set up a password for your ${providerValue} account.`);
          navigate("/setup-password", {
            state: {
              email,
              name,
              provider: providerValue,
            },
          });
        } else {
          // ✅ Existing user - login directly
          localStorage.setItem("user", email);
          alert(`Login successful: ${email}`);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(`${providerName} login error:`, err);
      const backendMessage = err?.response?.data?.message || err?.response?.data || err.message || err;
      alert(`Login failed: ${backendMessage}`);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={() => handleSocialLogin(googleProvider, "Google")}
        className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border bg-white hover:shadow-md transition"
      >
        <FcGoogle size={22} />
        Continue with Google
      </button>

      <button
        onClick={() => handleSocialLogin(githubProvider, "GitHub")}
        className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
      >
        <FaGithub size={20} />
        Continue with GitHub
      </button>
    </div>
  );
}