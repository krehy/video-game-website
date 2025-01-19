import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Review } from '../../types';

interface SmallReviewCardProps {
  review: Review;
}

const SmallReviewCard: React.FC<SmallReviewCardProps> = ({ review }) => {
  const [isHovered, setIsHovered] = useState(false);

  const averageScore = review.attributes
    ? review.attributes.reduce((acc, attribute) => acc + attribute.score, 0) / review.attributes.length
    : 0;

  return (
    <motion.div
      className="bg-gray-200 shadow-md rounded-lg overflow-hidden flex items-stretch mb-4 relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {review.main_image && review.main_image.url && (
        <div className="relative w-1/3 h-40 md:h-auto">
          <Link href={`/reviews/${review.slug}`}>
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`}
                alt={review.title || 'Review Image'}
                fill
                className="rounded-none object-cover"
              />
            </div>
          </Link>
        </div>
      )}
      <div className="w-2/3 flex flex-col justify-between p-4">
        <Link href={`/reviews/${review.slug}`}>
          <h3 className="text-sm font-bold text-black mb-2 truncate">{review.title}</h3>
        </Link>
        <div className="text-xs text-gray-500 flex items-center">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
          <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div
        title="Získané scóré"
        className="flex items-center justify-center text-black rounded-lg b-12 h-12 text-lg font-bold"
      >
      </div>
    </motion.div>
  );
};

export default SmallReviewCard;
