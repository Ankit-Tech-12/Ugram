import api from "../../utils/axios";

// 📸 CREATE POST
export const createPost = async (formData) => {
  const res = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // return clean post
  return res.data.data;
};


// 📰 GET FEED POSTS (other users)
export const getFeedPosts = async () => {
  const res = await api.get("/posts");

  // always return array
  return res.data?.data || [];
};


// 👤 GET MY POSTS
export const getMyPosts = async () => {
  const res = await api.get("/posts/me");

  return res.data?.data || [];
};

//LIKE AND UNLIKE
export const toggleLike = async (postId) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data.data;
};