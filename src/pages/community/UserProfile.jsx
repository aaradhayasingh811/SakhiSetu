import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCommunity } from '../../hooks/useCommunity.jsx';
import PostCard from '../../components/community/PostCard';
import axios from 'axios';
import { FiArrowLeft, FiCalendar, FiClock, FiMail } from 'react-icons/fi';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getPostsByUser } = useCommunity();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });

        if (!res.data || !res.data.data) {
          throw new Error('Invalid user data received');
        }

        setUser({
          ...res.data.data,
          name: res.data.data.name || 'Anonymous',
          email: res.data.data.email || '',
          lastActive: res.data.data.lastActive 
            ? new Date(res.data.data.lastActive).toLocaleDateString() 
            : 'Unknown',
          createdAt: res.data.data.createdAt 
            ? new Date(res.data.data.createdAt).toLocaleDateString()
            : 'Recently'
        });

        setPosts(res.data.posts || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <div className="text-center py-12 text-gray-500">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={handleBackClick}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img 
                src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'} 
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-purple-100"
                onError={(e) => {
                  e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s';
                }}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
              
              {user.email && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FiMail className="mr-2 text-purple-500" />
                  <span>{user.email}</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2 text-purple-500" />
                  <span>Last active: {user.lastActive}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2 text-purple-500" />
                  <span>Member since {user.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Recent Activity
        </h2>
        
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => {
              const safePost = {
                ...post,
                title: post.title || 'Untitled Post',
                content: post.content || '',
                author: {
                  _id: user._id,
                  name: user.name,
                  avatar: user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2MN75zQkPhIz5PMJ8ObHwyUOaakWizbIWw&s'
                },
                createdAt: post.createdAt || new Date().toISOString()
              };
              
              return <PostCard key={post._id} post={safePost} />;
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500 border border-gray-100">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-lg font-medium mb-1">No posts yet</h3>
              <p>This user hasn't shared any posts in the community.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;