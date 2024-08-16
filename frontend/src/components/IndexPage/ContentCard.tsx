import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';

interface ContentCardProps {
  content: any;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => (
  <div className="bg-white shadow-md rounded overflow-hidden relative">
    <div className="relative">
      <img
        src={`${process.env.NEXT_PUBLIC_INDEX_URL}${content.main_image.url}`}
        alt={content.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
        <h2 className="text-lg font-semibold">{content.title}</h2>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
        <span className="mr-4">{content.owner.username}</span>
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
        <span>{new Date(content.first_published_at).toLocaleDateString()}</span>
        <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
        <span>{content.read_count}</span>
      </div>
      <p className="text-gray-700 mb-4">{content.intro}</p>
      <div className="flex flex-wrap">
        {content.categories?.map((category: any) => (
          <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {category.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ContentCard;
