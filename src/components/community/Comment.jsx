// import { useState } from 'react';
// import moment from 'moment';
// import ReactionButtons from './ReactionButtons';

// const Comment = ({ comment }) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyContent, setReplyContent] = useState('');

//   return (
//     <div className="border-l-2 border-purple-200 pl-4 py-3">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <img 
//             src={comment.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'} 
//             alt={comment.author?.name}
//             className="h-8 w-8 rounded-full"
//           />
//         </div>
        
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <div className="font-medium text-sm text-gray-900">
//               {comment.author?.name}
//             </div>
//             <div className="text-xs text-gray-500">
//               {moment(comment.createdAt).fromNow()}
//             </div>
//           </div>
          
//           <p className="mt-1 text-sm text-gray-700">
//             {comment.content}
//           </p>
          
//           <div className="mt-2 flex items-center space-x-4">
//             <ReactionButtons 
//               itemId={comment._id}
//               itemType="comment"
//               reactions={comment.reactions}
//             />
            
//             <button 
//               onClick={() => setIsReplying(!isReplying)}
//               className="text-xs text-gray-500 hover:text-purple-600"
//             >
//               Reply
//             </button>
//           </div>
          
//           {isReplying && (
//             <div className="mt-3">
//               <textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Write your reply..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
//                 rows={2}
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   onClick={() => setIsReplying(false)}
//                   className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                 >
//                   Post Reply
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Comment;

// import { useState } from 'react';
// import moment from 'moment';
// import ReactionButtons from './ReactionButtons';
// import axios from 'axios'; 

// const Comment = ({ comment, postId, currentUser, onReplyAdded }) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyContent, setReplyContent] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmitReply = async () => {
//     if (!replyContent.trim()) return;
    
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/community/comments`, {
//         postId,
//         content: replyContent,
//         parentCommentId: comment._id
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       // Clear the form and close the reply box
//       setReplyContent('');
//       setIsReplying(false);
      
//       // Notify parent component that a reply was added
//       if (onReplyAdded) {
//         onReplyAdded(response.data);
//       }
//     } catch (error) {
//       console.error('Error submitting reply:', error);
//       // You might want to show an error message to the user here
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="border-l-2 border-purple-200 pl-4 py-3">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <img 
//             src={comment.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'} 
//             alt={comment.author?.name}
//             className="h-8 w-8 rounded-full"
//           />
//         </div>
        
//         <div className="flex-1">
//           <div className="flex items-center justify-between">
//             <div className="font-medium text-sm text-gray-900">
//               {comment.author?.name}
//             </div>
//             <div className="text-xs text-gray-500">
//               {moment(comment.createdAt).fromNow()}
//             </div>
//           </div>
          
//           <p className="mt-1 text-sm text-gray-700">
//             {comment.content}
//           </p>
          
//           <div className="mt-2 flex items-center space-x-4">
//             <ReactionButtons 
//               itemId={comment._id}
//               itemType="comment"
//               reactions={comment.reactions}
//             />
            
//             {currentUser && (
//               <button 
//                 onClick={() => setIsReplying(!isReplying)}
//                 className="text-xs text-gray-500 hover:text-purple-600"
//               >
//                 Reply
//               </button>
//             )}
//           </div>
          
//           {isReplying && (
//             <div className="mt-3">
//               <textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Write your reply..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
//                 rows={2}
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   onClick={() => setIsReplying(false)}
//                   className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmitReply}
//                   className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                   disabled={isSubmitting || !replyContent.trim()}
//                 >
//                   {isSubmitting ? 'Posting...' : 'Post Reply'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Comment;

import { useState } from 'react';
import moment from 'moment';
import ReactionButtons from './ReactionButtons';
import axios from 'axios'; 

const Comment = ({ comment, postId, currentUser, onReplyAdded, isReply = false }) => {
  console.log(comment)
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/community/comments`, {
        postId,
        content: replyContent,
        parentCommentId: comment._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setReplyContent('');
      setIsReplying(false);
      
      if (onReplyAdded) {
        onReplyAdded(response.data);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${isReply ? 'pl-6' : 'pl-0'} relative`}>
      {/* Thread line for replies */}
      {isReply && (
        <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gray-200"></div>
      )}
      
      <div className={`${isReply ? 'border-l-2 border-purple-200 pl-4' : ''} py-3`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={comment.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'} 
              alt={comment.author?.name}
              className={`${isReply ? 'h-7 w-7' : 'h-8 w-8'} rounded-full`}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm text-gray-900">
                {comment.author?.name}
                {isReply && (
                  <span className="ml-2 text-xs text-gray-500">
                    replied
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {moment(comment.createdAt).fromNow()}
              </div>
            </div>
            
            <p className={`mt-1 text-sm ${isReply ? 'text-gray-600' : 'text-gray-700'}`}>
              {comment.content}
            </p>
            
            <div className="mt-2 flex items-center space-x-4">
              <ReactionButtons 
                itemId={comment._id}
                itemType="comment"
                reactions={comment.reactions}
              />
              
              {currentUser && (
                <button 
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-xs text-gray-500 hover:text-purple-600"
                >
                  Reply
                </button>
              )}
            </div>
            
            {isReplying && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                  rows={2}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-3">
          {comment.replies.map(reply => (
            <Comment 
              key={reply._id}
              comment={reply}
              postId={postId}
              currentUser={currentUser}
              onReplyAdded={onReplyAdded}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;