import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import AnimatedNumber from './AnimatedNumber';

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

const ReviewCard = ({ review }) => {
  const averageScore = review.attributes.reduce((acc, attribute) => acc + attribute.score, 0) / review.attributes.length;

  return (
    <div className="bg-white shadow-md rounded overflow-hidden relative">
      {review.main_image && (
        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`}
            alt={review.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-[#8e67ea] bg-opacity-70 text-white p-2 flex justify-between items-center">
            <Link href={`/reviews/${review.slug}`}>
              <h2 className="text-lg font-semibold">{review.title}</h2>
            </Link>
            <Link href={`/reviews/${review.slug}`}>
              <span className="text-2xl font-bold text-white" title="Získané skóre">
                <AnimatedNumber number={averageScore} inView={true} />
              </span>
            </Link>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
          <span className="mr-4">{review.owner.username}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
          <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
          <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
          <span>{review.read_count}</span>
        </div>
        <p className="text-gray-700 mb-4 break-words">{review.intro}</p>
        <div className="flex flex-wrap">
          <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {reviewTypeTranslations[review.review_type]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
