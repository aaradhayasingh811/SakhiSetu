import { useState, useEffect } from 'react';
import communityService from '../services/communityService';

export const useCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async (categoryId, sort = 'latest', page = 1) => {
    try {
      setLoading(true);
      const data = await communityService.getPosts(categoryId, sort, page);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await communityService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchCategories,
    createPost: communityService.createPost,
    addComment: communityService.addComment,
    addReaction: communityService.addReaction
  };
};