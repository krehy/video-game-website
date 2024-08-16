import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';

const reviewTypeTranslations = {
  'Game': 'Hra',
  'Keyboard': 'Klávesnice',
  'Mouse': 'Myš',
  'Monitor': 'Monitor',
  'Computer': 'Počítač',
  'Headphones': 'Sluchátka',
  'Console': 'Konzole',
  'Mobile': 'Mobil',
  'Notebook': 'Notebook',
  'Microphone': 'Mikrofon'
};

const ReviewHeader = ({ review, readCount }) => {
  const cleanedUrlPath = review.url_path.replace('/placeholder', '');

  return (
    <>
      <h1 className="text-3xl font-bold mb-4 break-words">{review.title}</h1>
      {review.main_image && (
        <div className="relative mb-4">
          <img src={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} alt={review.title} className="w-full h-auto object-cover rounded" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
            <p className="mb-2 break-words">{review.intro}</p>
            <div className="flex items-center text-sm mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
              <span className="mr-4 break-words">{review.owner.username}</span>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
              <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
              <FontAwesomeIcon icon={faEye} className="mr-2 text-[#8e67ea] text-lg" style={{marginLeft:'15'}} />
              <span>{readCount}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 break-words">
                {reviewTypeTranslations[review.review_type]}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewHeader;
