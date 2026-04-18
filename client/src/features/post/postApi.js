import api from "../../utils/axios";

export const createPost = async (formData) => {
    
  const res = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getMyPosts = async () => {
  const res = await api.get("/posts/me");
  return res.data;
};

export const getFeedPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};