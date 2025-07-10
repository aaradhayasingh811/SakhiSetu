import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiCalendar, FiEdit, FiSave, FiX } from 'react-icons/fi';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    age: '',
    bio: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = { ...user };
      
      if (password) {
        updateData.password = password;
      }

      const res= await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data);
      setPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-300 to-rose-300 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl">
                  <FiUser />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{user.name || 'User'}</h1>
                  <p className="text-pink-100 text-sm">@{user.username}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditing ? 'bg-white text-pink-600 hover:bg-pink-50' : 'bg-pink-700 hover:bg-pink-600'}`}
              >
                {isEditing ? (
                  <>
                    <FiX className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" /> Edit Profile
                  </>
                )}
              </button>
              <button
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${isEditing ? 'bg-white text-pink-600 hover:bg-pink-50' : 'bg-pink-700 hover:bg-pink-600'}`}
              onClick={() => window.location.href = '/my-post'}
              >

                My Posts
              </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 text-sm">
                    <FiUser className="mr-2 text-pink-500" /> Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 bg-pink-50 rounded-lg text-sm">{user.name || 'Not provided'}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 text-sm">
                    <FiUser className="mr-2 text-pink-500" /> Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 bg-pink-50 rounded-lg text-sm">@{user.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 text-sm">
                    <FiMail className="mr-2 text-pink-500" /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      required
                    />
                  ) : (
                    <p className="px-4 py-2 bg-pink-50 rounded-lg text-sm">{user.email}</p>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 text-sm">
                    <FiCalendar className="mr-2 text-pink-500" /> Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={user.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-pink-50 rounded-lg text-sm">{user.age || 'Not provided'}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-gray-700 text-sm">
                    <FiUser className="mr-2 text-pink-500" /> Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={user.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-pink-50 rounded-lg text-sm min-h-[60px]">
                      {user.bio || 'No bio yet'}
                    </p>
                  )}
                </div>

                {/* Password Fields (only shown when editing) */}
                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700 text-sm">
                        <FiLock className="mr-2 text-pink-500" /> New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        placeholder="Leave blank to keep current"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-gray-700 text-sm">
                        <FiLock className="mr-2 text-pink-500" /> Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;