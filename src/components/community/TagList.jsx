import { Link } from 'react-router-dom';

const TagList = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {tags.map(tag => (
        <Link 
          key={tag._id} 
        //   to={`/community/tags/${tag._id}`}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded transition"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
};

export default TagList;