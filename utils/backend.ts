import axios from "axios";

const BackendRequest = axios.create({
  baseURL: process.env.BACKEND_ROUTE || process.env.NEXT_PUBLIC_BACKEND_ROUTE,
  timeout: 3000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Authorization: "token <your-token-here>",
  },
  withCredentials: true,
});

export default BackendRequest;
