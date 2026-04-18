import api from "../../utils/axios";

// 🔐 Login API
export const loginUser = async (data) => {
  const response = await api.post("/users/login", data);
  return response.data;
};