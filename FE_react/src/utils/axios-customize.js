import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = "http://localhost:8000/api/v1/";

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

instance.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("jwt")}`;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = (error && error.response && error.response.status) || 500;
    console.log(">>>check status: ", status);
    switch (status) {
      // authentication (token related issues)
      case 401: {
        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          toast.error("Unauthorized the user. Please login..");
        }
        return error.response.data;
      }

      // forbidden (permission related issues)
      case 403: {
        toast.error(`You don't permission to access this resource...`);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
