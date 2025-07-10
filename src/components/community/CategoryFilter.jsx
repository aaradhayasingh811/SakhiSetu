const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-2">
        {categories.map(category => (
          <li key={category._id}>
            <button
              onClick={() => onSelectCategory(category._id)}
              className={`w-full text-left px-3 py-2 rounded-md transition ${selectedCategory === category._id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;