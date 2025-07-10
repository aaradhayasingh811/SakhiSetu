import { useState, useEffect } from 'react';
import { useCommunity } from '../../hooks/useCommunity.jsx';

const reactionEmojis = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

const ReactionButtons = ({ itemId, itemType, reactions, currentUserId }) => {
  const [userReaction, setUserReaction] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { addReaction, removeReaction } = useCommunity();

  // Initialize user's reaction
  useEffect(() => {
    if (reactions && currentUserId) {
      const userReact = reactions.find(r => r.userId === currentUserId);
      if (userReact) {
        setUserReaction(userReact.type);
      }
    }
  }, [reactions, currentUserId]);

  const handleReaction = async (reactionType) => {
    try {
      // If clicking the same reaction, remove it
      if (userReaction === reactionType) {
        await removeReaction(itemType, itemId);
        setUserReaction(null);
      } else {
        await addReaction(itemType, itemId, reactionType);
        setUserReaction(reactionType);
      }
      setShowPicker(false);
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  // Count reactions by type
  const reactionCounts = reactions?.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {});

  // Get the most popular reaction (for display when picker is closed)
  const topReaction = reactionCounts 
    ? Object.entries(reactionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] 
    : null;

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 group"
        aria-label="React to this post"
      >
        <span className="text-lg">
          {userReaction 
            ? reactionEmojis[userReaction] 
            : (topReaction ? reactionEmojis[topReaction] : '👍')}
        </span>
        <span className="text-sm min-w-[1rem]">
          {reactions?.length || 0}
        </span>
      </button>
      
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10 border border-gray-100">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`text-xl hover:scale-125 transform transition ${userReaction === type ? 'scale-125' : ''}`}
              title={type}
              aria-label={`React with ${type}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;