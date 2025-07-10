import { useState, useEffect } from 'react';
import { useCommunity } from '../../hooks/useCommunity.jsx';
import PostCard from '../../components/community/PostCard';
import CategoryFilter from '../../components/community/CategoryFilter';
import CreatePostModal from '../../components/community/CreatePostModal';
import { FiPlus, FiFilter, FiClock, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommunityHome = () => {
  const { 
    posts, 
    categories, 
    loading, 
    fetchPosts,
    fetchCategories
  } = useCommunity();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCategories(); // Ensure categories are loaded first
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPosts(selectedCategory, sortBy);
    }
  }, [selectedCategory, sortBy]);

  const renderLoadingSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-100">
        <div className="flex items-center mb-4">
          <Skeleton circle width={40} height={40} />
          <div className="ml-3">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} className="mt-1" />
          </div>
        </div>
        <Skeleton height={20} width="80%" className="mb-3" />
        <Skeleton count={2} />
        <div className="flex mt-4">
          <Skeleton width={60} height={24} className="mr-3" />
          <Skeleton width={60} height={24} />
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Mobile first hidden, shown on lg screens */}
        <div className="lg:w-1/4 lg:block">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky top-6">
            <div className="flex items-center justify-between mb-4 lg:block">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiFilter className="mr-2" /> Categories
              </h2>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="lg:hidden flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition text-sm"
              >
                <FiPlus className="mr-1" /> New Post
              </button>
            </div>
            
            {loading && !categories.length ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} height={32} className="rounded-lg" />
                ))}
              </div>
            ) : (
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            )}
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="hidden lg:flex w-full items-center justify-center mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
            >
              <FiPlus className="mr-2" /> Create Post
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Mobile category dropdown - shown only on small screens */}
          <div className="lg:hidden mb-6">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-base bg-white"
              disabled={loading}
            >
              {loading ? (
                <option>Loading categories...</option>
              ) : (
                categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {loading ? (
                  <Skeleton width={180} />
                ) : (
                  categories.find(c => c._id === selectedCategory)?.name || 'Community'
                )}
              </h1>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-xl px-4 py-2 text-sm bg-white"
                  disabled={loading}
                >
                  <option value="latest" className="flex items-center">
                    <FiClock className="inline mr-2" /> Latest
                  </option>
                  <option value="popular">
                    <FiTrendingUp className="inline mr-2" /> Popular
                  </option>
                  <option value="most-comments">
                    <FiMessageSquare className="inline mr-2" /> Most Comments
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {renderLoadingSkeletons()}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
                  <p className="text-gray-500">Be the first to start a discussion in this category!</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
                  >
                    <FiPlus className="mr-2" /> Create Post
                  </button>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
      />
    </div>
  );
};

export default CommunityHome;