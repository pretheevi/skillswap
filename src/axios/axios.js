import axios from "axios";

const API = axios.create({
  baseURL:"https://skillswapserver-dyws.onrender.com/api",
});

// Add token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// "http://localhost:8080/api", "https://skillswapserver-dyws.onrender.com/api"