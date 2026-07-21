import api from "../../utils/axios.js";

export const toggleFollowing = async (userId) => {
  const res = await api.patch(`/users/${userId}/follow`);
  return res.data.data;
};