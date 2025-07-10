import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/community`;

const getPosts = async (categoryId, sort = 'latest', page = 1) => {
  const response = await axios.get(`${API_URL}/categories/${categoryId}/posts`, {
    params: { sort, page },
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  },
);
  return response.data;
};

const getPost = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}`,{
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  });
  return response.data;
};

const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData,{
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  });
  return response.data;
};

const addComment = async (commentData) => {
  const response = await axios.post(`${API_URL}/comments`, commentData,{
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  });
  return response.data;
};

const addReaction = async (itemType, itemId, reactionType) => {
  const response = await axios.post(`${API_URL}/reactions`, {
    itemType,
    itemId,
    reactionType
  },{
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  });
  return response.data;
};

const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`,{
    headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
  });
  return response.data;
};

export default {
  getPosts,
  getPost,
  createPost,
  addComment,
  addReaction,
  getCategories
};