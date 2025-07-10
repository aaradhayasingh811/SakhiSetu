import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL}`);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const joinUserRoom = (userId) => {
    if (socket) {
      socket.emit('joinUserRoom', userId);
    }
  };

  const joinPostRoom = (postId) => {
    if (socket) {
      socket.emit('joinPostRoom', postId);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('newNotification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    socket.on('newComment', (comment) => {
      // Handle real-time comment updates
    });

    return () => {
      socket.off('newNotification');
      socket.off('newComment');
    };
  }, [socket]);

  return (
    <CommunityContext.Provider value={{ 
      socket, 
      notifications,
      unreadCount,
      joinUserRoom,
      joinPostRoom,
      markAsRead: () => setUnreadCount(0)
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => useContext(CommunityContext);