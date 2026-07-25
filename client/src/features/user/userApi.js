import api from "../../utils/axios.js";

export const toggleFollowing = async (userId) => {
  const res = await api.patch(`/users/${userId}/follow`);
  return res.data.data;
};

export const getTargetUser = async (userId) => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data.data; 
};