import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSelfPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [expandedContent, setExpandedContent] = useState({});

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/community/my-posts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const toggleContentExpansion = (postId) => {
    setExpandedContent(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return '';
    }
  };

  const getEmoji = (type) => {
    const emojis = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😠'
    };
    return emojis[type] || '👍';
  };

  const countReactions = (reactions) => {
    if (!reactions || !Array.isArray(reactions)) return {};
    
    const counts = {};
    reactions.forEach(reaction => {
      if (reaction?.type) {
        counts[reaction.type] = (counts[reaction.type] || 0) + 1;
      }
    });
    return counts;
  };

  const sortComments = (comments) => {
    if (!comments || !Array.isArray(comments)) return [];
    
    return [...comments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="ml-4 text-sm bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">You haven't created any posts in the community.</p>
          <button 
            onClick={() => navigate('/community/create-post')}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
          >
            Create your first post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Posts</h1>
        </div>
        <div className="text-sm text-gray-500">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </div>
      </div>
      
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <div className="relative">
                  <img 
                    src={post.author?.avatar || '/default-avatar.png'} 
                    alt={post.author?.name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{post.author?.name || 'User'}</h3>
                  {post.author?.username && (
                    <p className="text-sm text-gray-500">@{post.author.username}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:items-end">
                {post.category?.name && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full mb-1">
                    {post.category.name}
                  </span>
                )}
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title || 'Untitled Post'}</h2>
              <div className="text-gray-700 mb-4 whitespace-pre-line">
                {expandedContent[post._id] ? post.content : `${post.content?.substring(0, 200) || ''}`}
                {post.content?.length > 200 && (
                  <button 
                    onClick={() => toggleContentExpansion(post._id)}
                    className="text-indigo-600 hover:text-indigo-800 ml-2 text-sm font-medium transition-colors"
                  >
                    {expandedContent[post._id] ? 'Show less' : '...Read more'}
                  </button>
                )}
              </div>
              
              {post.image && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full max-h-96 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map(tag => (
                    <span 
                      key={tag._id} 
                      className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reactions */}
            <div className="px-4 sm:px-6 py-3 border-t border-b border-gray-100 flex items-center space-x-4 overflow-x-auto">
              {Object.entries(countReactions(post.reactions)).map(([type, count]) => (
                <div key={type} className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-lg">{getEmoji(type)}</span>
                  <span className="text-sm text-gray-600 font-medium">{count}</span>
                </div>
              ))}
            </div>

            {/* Comments Toggle */}
            <div className="px-4 sm:px-6 py-3">
              <button 
                onClick={() => toggleComments(post._id)}
                className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
              >
                {expandedPostId === post._id ? (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Comments
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    Show Comments ({post.comments?.length || 0})
                  </>
                )}
              </button>
            </div>

            {/* Comments Section */}
            {expandedPostId === post._id && (
              <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments ({post.comments?.length || 0})
                </h3>
                
                {!post.comments || post.comments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortComments(post.comments).map(comment => (
                      <div key={comment._id} className="bg-white p-4 rounded-lg shadow-xs border border-gray-100">
                        {/* Comment Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={comment.author?.avatar || '/default-avatar.png'} 
                            alt={comment.author?.name || 'User'} 
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{comment.author?.name || 'User'}</h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Comment Content */}
                        <div className="ml-11">
                          {comment.parentCommentId && (
                            <div className="bg-gray-50 p-2 rounded mb-2 text-sm border-l-2 border-indigo-200">
                              <p className="text-gray-500 text-xs mb-1">
                                Replying to {comment.parentCommentId?.author?.name || 'user'}
                              </p>
                              <p className="text-gray-700 truncate">
                                {comment.parentCommentId?.content}
                              </p>
                            </div>
                          )}
                          <p className="text-gray-800 whitespace-pre-line">{comment.content}</p>
                          
                          {/* Comment Reactions */}
                          {comment.reactions?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3 -ml-1">
                              {comment.reactions.map(reaction => (
                                <span 
                                  key={reaction._id} 
                                  className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 flex items-center"
                                  title={`${reaction.userId?.name || 'User'} reacted with ${reaction.type}`}
                                >
                                  <span className="mr-1">{getEmoji(reaction.type)}</span>
                                  <span className="text-gray-600 text-xs">{reaction.userId?.name.split(' ')[0] || 'User'}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelfPosts;