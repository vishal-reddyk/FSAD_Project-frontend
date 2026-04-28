import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "https://fsadproject-backendd-production.up.railway.app";

const api = axios.create({
  baseURL,
  timeout: 15000,
});

export default api;