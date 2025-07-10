import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../../components/community/PostCard';
import Comment from '../../components/community/Comment';
import { FiArrowLeft, FiMessageSquare, FiSend } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        }
      );
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

const submitComment = async (commentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/community/comments`,
        commentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }  
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setError('');

    try {
      const comment = await submitComment({
        postId,
        content: newComment
      });
      
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));
      
      setNewComment('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton height={30} width="70%" className="mb-4" />
            <div className="flex items-center mb-4">
              <Skeleton circle width={40} height={40} />
              <div className="ml-3">
                <Skeleton width={120} height={16} />
                <Skeleton width={80} height={12} className="mt-1" />
              </div>
            </div>
            <Skeleton count={3} />
            <div className="flex mt-4">
              <Skeleton width={60} height={24} className="mr-3" />
              <Skeleton width={60} height={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton height={24} width="40%" className="mb-4" />
            <Skeleton height={100} />
            <Skeleton height={36} width={120} className="mt-3" />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton height={24} width="30%" className="mb-4" />
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-center mb-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton width={100} height={14} className="ml-2" />
                </div>
                <Skeleton count={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Post Not Found</h2>
          <p className="text-gray-500">The post you're looking for doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Community
      </button>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Post content */}
      <PostCard post={post} fullView={true} />
      
      {/* Comment form */}
      {/* <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiMessageSquare className="mr-2 text-purple-500" /> Add a Comment
        </h3>
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            rows={4}
            required
            disabled={isSubmittingComment}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition disabled:opacity-50"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? (
                'Posting...'
              ) : (
                <>
                  <FiSend className="mr-2" /> Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div> */}
      
      {/* Comments list */}
     <div className="mt-8">
  {post.comments?.length === 0 && (
    <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-200">
      <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No comments yet</h3>
      <p className="text-gray-500">Be the first to share your thoughts!</p>
    </div>
  )}
</div>

    </div>
  );
};

export default PostDetail;