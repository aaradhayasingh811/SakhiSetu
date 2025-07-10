import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import TagList from './TagList';
import ReactionButtons from './ReactionButtons';
import Comment from './Comment';
import { FiSend, FiEye, FiMessageSquare } from 'react-icons/fi';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [currentPost, setCurrentPost] = useState(post);

  // Reaction emoji mapping
  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };

  // Count reactions by type
  const reactionCounts = currentPost.reactions?.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {});

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

  // Group comments by parentCommentId to handle replies
  const groupComments = (comments) => {
    if (!comments) return [];
    
    const commentMap = {};
    const rootComments = [];
    
    // First pass: store all comments in a map
    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });
    
    // Second pass: build the hierarchy
    comments.forEach(comment => {
      if (comment.parentCommentId) {
        if (commentMap[comment.parentCommentId]) {
          commentMap[comment.parentCommentId].replies.push(commentMap[comment._id]);
        }
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });
    
    return rootComments;
  };

  const groupedComments = groupComments(currentPost.comments);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={currentPost.author.avatar} 
              alt={currentPost.author.name}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40';
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link 
                  to={`/community/profile/${currentPost.author._id}`}
                  className="font-medium text-purple-600 hover:underline"
                >
                  {currentPost.author.name}
                </Link>
                {currentPost.category && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {currentPost.category.name}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {moment(currentPost.createdAt).fromNow()}
              </span>
            </div>
            
            <Link to={`/community/posts/${currentPost._id}`}>
              <h3 className="mt-1 text-lg font-semibold text-gray-900 hover:text-purple-600">
                {currentPost.title}
              </h3>
            </Link>
            
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {currentPost.content}
            </p>
            
            {/* Display all reactions with counts */}
            {reactionCounts && Object.keys(reactionCounts).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(reactionCounts)
                  .sort((a, b) => b[1] - a[1]) // Sort by count descending
                  .map(([type, count]) => (
                    <div 
                      key={type} 
                      className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200 text-sm"
                    >
                      <span className="mr-1 text-base">{reactionEmojis[type] || '❓'}</span>
                      <span className="font-medium text-gray-700">{count}</span>
                    </div>
                  ))}
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ReactionButtons 
                  itemId={currentPost._id}
                  itemType="post"
                  reactions={currentPost.reactions}
                />
                
                <div className="flex items-center text-sm text-gray-500">
                  <FiEye className="mr-1" />
                  {currentPost.viewCount || 0} views
                </div>
              </div>
              
              <button 
                onClick={toggleComments}
                className="flex items-center text-sm text-gray-500 hover:text-purple-600"
              >
                <FiMessageSquare className="mr-1" />
                {currentPost.comments?.length || 0} comments
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showComments && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Comments ({currentPost.comments?.length || 0})
            </h4>
            {groupedComments.length > 0 ? (
              groupedComments.map(comment => (
                <Comment 
                  key={comment._id} 
                  comment={comment} 
                  postId={currentPost._id} 
                  currentUser={currentPost.author} 
                  onReplyAdded={(newComment) => {
                    setCurrentPost(prev => ({
                      ...prev,
                      comments: [...(prev.comments || []), newComment]
                    }));
                  }}
                />
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
                rows={3}
                required
                disabled={isSubmittingComment}
              />
              <button 
                type="submit"
                className="mt-2 flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition disabled:opacity-50"
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