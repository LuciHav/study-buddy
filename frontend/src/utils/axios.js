import Axios from "axios";
import { toast } from "sonner";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  async (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user)?.token : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const response = error.response;

    const defaultError = {
      success: false,
      message: "Something went wrong. Please try again later.",
      data: null,
    };

    if (!response) {
      toast.error("Network error, please check your connection.");
      return defaultError;
    }

    const { status, data } = response;

    if (status === 403) {
      console.error("Forbidden: ", data?.message || error);
    } else if (status === 401) {
      console.error("Unauthorized: ", data?.message || error);
    }

    if (data?.message) {
      toast.error(data.message);
    }

    return {
      success: false,
      message: data?.message || "An error occurred",
      data: null,
    };
  }
);

export default axios;
