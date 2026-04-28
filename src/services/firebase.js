import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVqQIA2WkQe2FByVRbxHGuSDlUqnT8vnA",
  authDomain: "fullstack-91ea3.firebaseapp.com",
  projectId: "fullstack-91ea3",
  appId: "1:216864558018:web:0957ebe32d696e742ba45b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);