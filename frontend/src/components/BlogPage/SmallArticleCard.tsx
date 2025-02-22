import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Article } from '../../types';

interface SmallArticleCardProps {
  article: Article;
}

const SmallArticleCard: React.FC<SmallArticleCardProps> = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-gray-200 shadow-md rounded-lg overflow-hidden flex items-stretch mb-4 relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {article.main_image && article.main_image.url && (
        <div className="relative w-1/3 h-40 md:h-auto">
          <Link href={`/blog/${article.slug}`}>
            <div className="relative w-full h-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
                alt={article.title || 'Article Image'}
                fill
                className="rounded-none object-cover"
              />
            </div>
          </Link>
        </div>
      )}
      <div className="w-2/3 flex flex-col justify-between p-4">
        <Link href={`/blog/${article.slug}`}>
          <h3 className="text-sm font-bold text-black mb-2 truncate">{article.title}</h3>
        </Link>
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
            <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEye} className="mr-1 text-[#8e67ea]" />
            <span>{article.read_count}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SmallArticleCard;
