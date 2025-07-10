import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCommunity } from '../../../hooks/useCommunity';
import PostCard from '../../../components/community/PostCard';
import CreatePostModal from '../../../components/community/CreatePostModal';

const CategoryView = () => {
  const { categoryId } = useParams();
  const { 
    posts, 
    categories, 
    loading, 
    error, 
    fetchPosts,
    createPost
  } = useCommunity();
  const [sortBy, setSortBy] = useState('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const category = categories.find(c => c._id === categoryId);
      setCurrentCategory(category);
      fetchPosts(categoryId, sortBy);
    }
  }, [categoryId, categories, sortBy]);

  const handleCreatePost = async (postData) => {
    try {
      await createPost({
        ...postData,
        category: categoryId
      });
      setShowCreateModal(false);
      fetchPosts(categoryId, sortBy); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <CategoryFilter />
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          {currentCategory && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h1>
              {currentCategory.description && (
                <p className="text-gray-600 mt-2">{currentCategory.description}</p>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition"
            >
              Create Post
            </button>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="most-comments">Most Comments</option>
            </select>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No posts found in this category. Be the first to post!
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
        categories={categories}
        defaultCategory={categoryId}
      />
    </div>
  );
};

export default CategoryView;