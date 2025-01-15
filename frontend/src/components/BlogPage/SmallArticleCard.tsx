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
      className="bg-gray-200 shadow-md rounded-lg overflow-hidden flex items-center justify-between mb-4 p-4 relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {article.main_image && (
        <div className="w-1/3 relative">
          <Link href={`/blog/${article.slug}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
              alt={article.title}
              width={100}
              height={100}
              objectFit="cover"
              className="rounded-lg"
            />
          </Link>

        </div>
      )}
      <div className="w-2/3 flex flex-col justify-between px-4">
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
