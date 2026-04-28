import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNJRc87EdnzTVnf0DiaxYcSIxLpAwgWr4",
  authDomain: "fullstack-91ea3-871c8.firebaseapp.com",
  projectId: "fullstack-91ea3-871c8",
  storageBucket: "fullstack-91ea3-871c8.firebasestorage.app",
  messagingSenderId: "806145650",
  appId: "1:806145650:web:bff47a18604ae7dea17ceb",
  measurementId: "G-0N0RLXX7Y8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
