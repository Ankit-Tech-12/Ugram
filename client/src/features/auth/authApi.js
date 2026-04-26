import api from "../../utils/axios.js";

// 🔐 Login API
export const loginUser = async (data) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const registerUser = async (formData) => {
  const res = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};