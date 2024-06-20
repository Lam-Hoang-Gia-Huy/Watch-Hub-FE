import axios from "axios";

// Replace this with your authentication logic
const getAuthToken = () => {
  // Logic to get the auth token, e.g., from localStorage
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth ? auth.accessToken : "";
};

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
