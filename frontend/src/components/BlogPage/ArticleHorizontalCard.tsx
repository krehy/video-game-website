import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArticleCardProps } from '../../types';

const ArticleHorizontalCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="flex flex-col md:flex-row bg-white shadow-lg rounded overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {article.main_image && (
        <div className="relative w-full h-48 md:h-auto md:w-1/2 overflow-hidden order-1 md:order-none">
          <Link href={`/blog/${article.slug}`}>
            <div className="w-full h-full group">
              <Image
                src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
                alt={article.title}
                fill
                className="group-hover:scale-110 transition-transform duration-500 object-cover"
              />
            </div>
          </Link>
        </div>
      )}
      <div className="flex flex-col justify-between p-4 w-full md:w-1/2 order-2 md:order-none">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </h2>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
            <span className="mr-4">{article.owner.username}</span>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
            <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
            <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
            <span className="ml-1">{article.read_count}</span>
          </div>
          <p className="text-gray-700 mb-4">{article.intro}</p>
        </div>
        <div className="flex flex-wrap">
          {article.categories.map((category) => (
            <span
              key={category.id}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleHorizontalCard;
