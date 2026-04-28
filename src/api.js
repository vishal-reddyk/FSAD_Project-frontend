import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 15000,
});

export default api;