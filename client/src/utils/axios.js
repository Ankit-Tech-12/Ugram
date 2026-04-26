import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8000/api/v1", // your backend http://localhost:8000/api/v1/
  baseURL: "https://ugram-backend.onrender.com/api/v1",
  withCredentials: true,
});

export default api;