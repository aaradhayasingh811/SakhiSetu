import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import TagList from './TagList';
import ReactionButtons from './ReactionButtons';
import Comment from './Comment';
import { FiSend } from 'react-icons/fi';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [currentPost, setCurrentPost] = useState(post);

  const toggleComments = () => {
    setShowComments(!showComments);
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
        postId: currentPost._id,
        content: newComment
      });
      
      setCurrentPost(prev => ({
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={currentPost.author.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'} 
              alt={currentPost.author.name}
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link 
                to={`/community/profile/${currentPost.author._id}`}
                className="font-medium text-purple-600 hover:underline"
              >
                {currentPost.author?.name}
              </Link>
              <span className="text-sm text-gray-500">
                {moment(currentPost.createdAt).fromNow()}
              </span>
            </div>
            
            <Link to={`/community/posts/${currentPost._id}`}>
              <h3 className="mt-1 text-lg font-semibold text-gray-900 hover:text-purple-600">
                {currentPost.title}
              </h3>
            </Link>
            
            <p className="mt-2 text-gray-600">
              {currentPost.content.length > 200 ? `${currentPost.content.substring(0, 200)}...` : currentPost.content}
            </p>
            
            <TagList tags={currentPost.tags} />
            
            <div className="mt-4 flex items-center justify-between">
              <ReactionButtons 
                itemId={currentPost._id}
                itemType="post"
                reactions={currentPost.reactions}
              />
              
              <button 
                onClick={toggleComments}
                className="flex items-center text-sm text-gray-500 hover:text-purple-600"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {currentPost.comments?.length || 0} comments
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showComments && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
            {currentPost.comments?.length > 0 ? (
              currentPost.comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
              ))
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>
          
          <div className="mt-4">
            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
                required
                disabled={isSubmittingComment}
              />
              <button 
                type="submit"
                className="mt-2 flex items-center bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-lg text-sm transition disabled:opacity-50"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? (
                  'Posting...'
                ) : (
                  <>
                    <FiSend className="mr-1" /> Post Comment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;