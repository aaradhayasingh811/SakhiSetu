import { useState } from 'react';
import { useCommunity } from '../../hooks/useCommunity.jsx';

const reactionEmojis = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

const ReactionButtons = ({ itemId, itemType, reactions }) => {
  const [userReaction, setUserReaction] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const { addReaction } = useCommunity();

  const handleReaction = async (reactionType) => {
    try {
      await addReaction(itemType, itemId, reactionType);
      setUserReaction(reactionType);
      setShowPicker(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center space-x-1 text-gray-500 hover:text-purple-600"
      >
        <span>{userReaction ? reactionEmojis[userReaction] : '👍'}</span>
        <span className="text-sm">
          {reactions?.length || 0}
        </span>
      </button>
      
      {showPicker && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className="text-xl hover:scale-125 transform transition"
              title={type}
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