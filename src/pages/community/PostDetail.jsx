// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import PostCard from '../../components/community/PostCard';
// // import Comment from '../../components/community/Comment';
// // import { FiArrowLeft, FiMessageSquare, FiSend } from 'react-icons/fi';
// // import Skeleton from 'react-loading-skeleton';
// // import 'react-loading-skeleton/dist/skeleton.css';

// // const PostDetail = () => {
// //   const { postId } = useParams();
// //   const navigate = useNavigate();
// //   const [post, setPost] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [newComment, setNewComment] = useState('');
// //   const [error, setError] = useState('');
// //   const [isSubmittingComment, setIsSubmittingComment] = useState(false);

// //   const fetchPost = async () => {
// //     try {
// //       const response = await axios.get(
// //         `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
// //             'Accept': 'application/json',
// //           }
// //         }
// //       );
// //       console.log('Fetched post:', response.data);
// //       setPost(response.data);
// //     } catch (error) {
// //       console.error('Error fetching post:', error);
// //       setError('Failed to load post. Please try again later.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// // const submitComment = async (commentData) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_API_URL}/api/community/comments`,
// //         commentData,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           }  
// //         }
// //       );
// //       return response.data;
// //     } catch (error) {
// //       console.error('Error adding comment:', error);
// //       throw error;
// //     }
// //   };

// //   const handleSubmitComment = async (e) => {
// //     e.preventDefault();
// //     if (!newComment.trim()) return;

// //     setIsSubmittingComment(true);
// //     setError('');

// //     try {
// //       const comment = await submitComment({
// //         postId,
// //         content: newComment
// //       });
      
// //       setPost(prev => ({
// //         ...prev,
// //         comments: [...(prev.comments || []), comment]
// //       }));
      
// //       setNewComment('');
// //     } catch (error) {
// //       setError(error.response?.data?.message || 'Failed to add comment. Please try again.');
// //     } finally {
// //       setIsSubmittingComment(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPost();
// //   }, [postId]);

// //   if (loading) {
// //     return (
// //       <div className="container mx-auto px-4 py-8 max-w-3xl">
// //         <button 
// //           onClick={() => navigate(-1)}
// //           className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
// //         >
// //           <FiArrowLeft className="mr-2" /> Back
// //         </button>
// //         <div className="space-y-6">
// //           <div className="bg-white rounded-xl shadow-sm p-6">
// //             <Skeleton height={30} width="70%" className="mb-4" />
// //             <div className="flex items-center mb-4">
// //               <Skeleton circle width={40} height={40} />
// //               <div className="ml-3">
// //                 <Skeleton width={120} height={16} />
// //                 <Skeleton width={80} height={12} className="mt-1" />
// //               </div>
// //             </div>
// //             <Skeleton count={3} />
// //             <div className="flex mt-4">
// //               <Skeleton width={60} height={24} className="mr-3" />
// //               <Skeleton width={60} height={24} />
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-xl shadow-sm p-6">
// //             <Skeleton height={24} width="40%" className="mb-4" />
// //             <Skeleton height={100} />
// //             <Skeleton height={36} width={120} className="mt-3" />
// //           </div>
          
// //           <div className="bg-white rounded-xl shadow-sm p-6">
// //             <Skeleton height={24} width="30%" className="mb-4" />
// //             {Array(3).fill(0).map((_, i) => (
// //               <div key={i} className="mb-4">
// //                 <div className="flex items-center mb-2">
// //                   <Skeleton circle width={32} height={32} />
// //                   <Skeleton width={100} height={14} className="ml-2" />
// //                 </div>
// //                 <Skeleton count={2} />
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!post) {
// //     return (
// //       <div className="container mx-auto px-4 py-8 max-w-3xl">
// //         <button 
// //           onClick={() => navigate(-1)}
// //           className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
// //         >
// //           <FiArrowLeft className="mr-2" /> Back
// //         </button>
// //         <div className="text-center py-12 bg-white rounded-xl shadow-sm">
// //           <h2 className="text-xl font-semibold text-gray-700 mb-2">Post Not Found</h2>
// //           <p className="text-gray-500">The post you're looking for doesn't exist or may have been removed.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8 max-w-3xl">
// //       {/* Back button */}
// //       <button 
// //         onClick={() => navigate(-1)}
// //         className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
// //       >
// //         <FiArrowLeft className="mr-2" /> Back to Community
// //       </button>

// //       {/* Error message */}
// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
// //           {error}
// //         </div>
// //       )}

// //       {/* Post content */}
// //       <PostCard post={post} fullView={true} />
      
// //       {/* Comment form */}
// //       {/* <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
// //         <h3 className="text-lg font-semibold mb-4 flex items-center">
// //           <FiMessageSquare className="mr-2 text-purple-500" /> Add a Comment
// //         </h3>
// //         <form onSubmit={handleSubmitComment}>
// //           <textarea
// //             value={newComment}
// //             onChange={(e) => setNewComment(e.target.value)}
// //             placeholder="Share your thoughts..."
// //             className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
// //             rows={4}
// //             required
// //             disabled={isSubmittingComment}
// //           />
// //           <div className="flex justify-end mt-3">
// //             <button
// //               type="submit"
// //               className="flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition disabled:opacity-50"
// //               disabled={isSubmittingComment}
// //             >
// //               {isSubmittingComment ? (
// //                 'Posting...'
// //               ) : (
// //                 <>
// //                   <FiSend className="mr-2" /> Post Comment
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </form>
// //       </div> */}
      
// //       {/* Comments list */}
// //      <div className="mt-8">
// //   {post.comments?.length === 0 && (
// //     <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-200">
// //       <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
// //       <h3 className="text-xl font-semibold text-gray-800 mb-2">No comments yet</h3>
// //       <p className="text-gray-500">Be the first to share your thoughts!</p>
// //     </div>
// //   )}
// // </div>

// //     </div>
// //   );
// // };

// // export default PostDetail;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import PostCard from '../../components/community/PostCard';
// import Comment from '../../components/community/Comment';
// import { FiArrowLeft, FiMessageSquare, FiSend, FiEye, FiFlag } from 'react-icons/fi';
// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

// const PostDetail = () => {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);

//   const fetchPost = async () => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Accept': 'application/json',
//           }
//         }
//       );
//       setPost(response.data);
      
//       // Fetch current user data if needed
//       const userResponse = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/auth/me`,
//         {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );
//       setCurrentUser(userResponse.data);
//     } catch (error) {
//       console.error('Error fetching post:', error);
//       setError('Failed to load post. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddComment = async (newComment) => {
//     try {
//       setPost(prev => ({
//         ...prev,
//         comments: [...(prev.comments || []), newComment]
//       }));
//     } catch (error) {
//       setError('Failed to update comments. Please refresh the page.');
//     }
//   };

//   useEffect(() => {
//     fetchPost();
//   }, [postId]);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-3xl">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
//         >
//           <FiArrowLeft className="mr-2" /> Back
//         </button>
//         <div className="space-y-6">
//           <Skeleton height={400} className="rounded-xl" />
//           <Skeleton height={200} className="rounded-xl" />
//         </div>
//       </div>
//     );
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-3xl">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
//         >
//           <FiArrowLeft className="mr-2" /> Back
//         </button>
//         <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">Post Not Found</h2>
//           <p className="text-gray-500">The post you're looking for doesn't exist or may have been removed.</p>
//         </div>
//       </div>
//     );
//   }

//   // Organize comments into parent and nested comments
//   const organizeComments = (comments) => {
//     if (!comments) return [];
    
//     const parentComments = comments.filter(comment => !comment.parentCommentId);
//     const nestedComments = comments.filter(comment => comment.parentCommentId);
    
//     return parentComments.map(parent => ({
//       ...parent,
//       replies: nestedComments.filter(reply => 
//         reply.parentCommentId && reply.parentCommentId._id === parent._id
//       )
//     }));
//   };

//   const organizedComments = organizeComments(post.comments);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3xl">
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
//       >
//         <FiArrowLeft className="mr-2" /> Back to Community
//       </button>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
//           {error}
//         </div>
//       )}

//       {/* Post content with all details */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div className="flex items-center space-x-3">
//               <img 
//                 src={post.author?.avatar} 
//                 alt={post.author?.name}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <h3 className="font-medium text-gray-900">{post.author?.name}</h3>
//                 <p className="text-xs text-gray-500">@{post.author?.username}</p>
//               </div>
//             </div>
//             <div className="text-xs text-gray-500">
//               Posted in <span className="font-medium text-purple-600">{post.category?.name}</span>
//             </div>
//           </div>

//           <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
//           <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

//           <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
//             <div className="flex items-center space-x-4">
//               <span className="flex items-center">
//                 <FiEye className="mr-1" /> {post.viewCount} views
//               </span>
//               <span>
//                 {new Date(post.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </span>
//             </div>
//             <div className="flex items-center space-x-4">
//               {post.isPinned && (
//                 <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
//                   Pinned
//                 </span>
//               )}
//               {post.isClosed && (
//                 <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
//                   Closed
//                 </span>
//               )}
//               <button className="hover:text-purple-600">
//                 <FiFlag />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Reactions */}
//         {
//   post.reactions?.length > 0 && (
//     <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
//       <div className="flex items-center flex-wrap gap-2">
//         {/* Group reactions by type and count them */}
//         {Object.entries(
//           post.reactions.reduce((acc, reaction) => {
//             acc[reaction.type] = (acc[reaction.type] || 0) + 1;
//             return acc;
//           }, {})
//         )
//         .sort((a, b) => b[1] - a[1]) // Sort by count descending
//         .map(([type, count]) => {
//           // Map reaction types to emojis
//           const emojiMap = {
//             like: '👍',
//             love: '❤️',
//             laugh: '😂',
//             wow: '😮',
//             sad: '😢',
//             angry: '😠'
//           };
          
//           return (
//             <div 
//               key={type} 
//               className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-xs"
//             >
//               <span className="mr-1">{emojiMap[type] || '❓'}</span>
//               <span className="text-sm font-medium text-gray-700">{count}</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   )
// }
//       </div>

//       {/* Comments section */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-lg font-semibold flex items-center">
//             <FiMessageSquare className="mr-2 text-purple-500" /> 
//             {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
//           </h3>
//         </div>

//         {organizedComments.length === 0 ? (
//           <div className="p-8 text-center">
//             <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No comments yet</h3>
//             <p className="text-gray-500">Be the first to share your thoughts!</p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {organizedComments.map(comment => (
//               <div key={comment._id} className="p-6">
//                 <Comment 
//                   comment={comment}
//                   postId={postId}
//                   currentUser={currentUser}
//                   onReplyAdded={handleAddComment}
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//         {/* add comment button */}
//       </div>
//     </div>
//   );
// };

// export default PostDetail;

import { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import Comment from '../../components/community/Comment';
import { FiArrowLeft, FiMessageSquare, FiSend, FiEye, FiFlag } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const fetchPost = async () => {
    try {
      const [postResponse, userResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/community/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      setPost(postResponse.data);
      setCurrentUser(userResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/community/comments`,
        {
          postId,
          content: newComment
        },
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    setError('');

    try {
      const comment = await submitComment();
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment],
        commentCount: (prev.commentCount || 0) + 1
      }));
      setNewComment('');
      setShowCommentForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplyAdded = (newComment) => {
    setPost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
      commentCount: (prev.commentCount || 0) + 1
    }));
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
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Skeleton circle width={40} height={40} />
                <div>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={80} height={14} className="mt-1" />
                </div>
              </div>
              <Skeleton width={100} height={14} />
            </div>
            <Skeleton height={24} width="80%" className="mb-3" />
            <Skeleton count={3} />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <Skeleton width={80} height={20} />
                <Skeleton width={80} height={20} />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton width={24} height={24} />
                <Skeleton width={24} height={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <Skeleton width={120} height={24} />
              <Skeleton width={100} height={36} />
            </div>
            <Skeleton height={150} />
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

  const organizeComments = (comments) => {
    if (!comments) return [];
    
    const commentMap = {};
    const rootComments = [];
    
    comments.forEach(comment => {
      commentMap[comment._id] = { ...comment, replies: [] };
    });
    
    comments.forEach(comment => {
      const parentId = comment.parentCommentId?._id || comment.parentCommentId;
      if (parentId && commentMap[parentId]) {
        commentMap[parentId].replies.push(commentMap[comment._id]);
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });
    
    return rootComments;
  };

  const organizedComments = organizeComments(post.comments);
  const reactionCounts = post.reactions?.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Community
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Post content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={post.author?.avatar} 
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
              <div>
                <Link 
                  to={`/community/profile/${post.author?._id}`}
                  className="font-medium text-gray-900 hover:text-purple-600"
                >
                  {post.author?.name}
                </Link>
                <p className="text-xs text-gray-500">@{post.author?.username}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {post.category && (
                <span className="font-medium text-purple-600">
                  {post.category.name}
                </span>
              )}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FiEye className="mr-1" /> {post.viewCount || 0} views
              </span>
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {post.isPinned && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  Pinned
                </span>
              )}
              {post.isClosed && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                  Closed
                </span>
              )}
              <button className="hover:text-purple-600">
                <FiFlag />
              </button>
            </div>
          </div>
        </div>

        {/* Reactions */}
        {reactionCounts && Object.keys(reactionCounts).length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <div className="flex items-center flex-wrap gap-2">
              {Object.entries(reactionCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const emojiMap = {
                    like: '👍',
                    love: '❤️',
                    laugh: '😂',
                    wow: '😮',
                    sad: '😢',
                    angry: '😠'
                  };
                  
                  return (
                    <div 
                      key={type} 
                      className="flex items-center bg-white px-3 py-1 rounded-full border border-gray-200 shadow-xs"
                    >
                      <span className="mr-1">{emojiMap[type] || '❓'}</span>
                      <span className="text-sm font-medium text-gray-700">{count}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <FiMessageSquare className="mr-2 text-purple-500" /> 
            {post.commentCount || post.comments?.length || 0} Comments
          </h3>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition"
          >
            <FiMessageSquare className="mr-2" />
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        </div>

        {/* Comment form */}
        {showCommentForm && (
          <div className="p-6 border-b border-gray-100">
            <form onSubmit={handleAddComment}>
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
          </div>
        )}

        {organizedComments.length === 0 ? (
          <div className="p-8 text-center">
            <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {organizedComments.map(comment => (
              <div key={comment._id} className="p-6">
                <Comment 
                  comment={comment}
                  postId={postId}
                  currentUser={currentUser}
                  onReplyAdded={handleReplyAdded}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;