// src/components/BlogPage/ArticleCard.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArticleCardProps } from '../../types';

const ArticleCard: React.FC<ArticleCardProps> = ({ article, info }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="bg-white shadow-md rounded overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {article.main_image && (
        <div className="relative">
          <Link href={`/blog/${article.slug}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
              alt={article.title}
              width={800} // Adjust the width according to your design
              height={300} // Adjust the height according to your design
              layout="responsive"
              objectFit="cover"
              className="rounded-t"
            />
          </Link>
          {info && (
            <motion.div 
              initial={{ y: '-100%' }}
              animate={isHovered ? { y: 0 } : { y: '-100%' }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full p-2"
              style={{
                backgroundImage: 'linear-gradient(to bottom, black, transparent)',
              }}
            >
              <p className="text-center text-[#8e67ea] font-bold text-4xl" 
                 style={{
                   letterSpacing: '0.25em',
                   textTransform: 'uppercase',
                   margin: 0,
                 }}>
                Článek
              </p>
            </motion.div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
            <Link href={`/blog/${article.slug}`}>
              <h2 className="text-lg font-semibold">{article.title}</h2>
            </Link>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
          <span className="mr-4">{article.owner.username}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
          <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
          <FontAwesomeIcon style={{marginRight:'7px'}} icon={faEye} className="ml-4 text-[#8e67ea]" />
          <span>{article.read_count}</span>
        </div>
        <p className="text-gray-700 mb-4">{article.intro}</p>
        <div className="flex flex-wrap">
          {article.categories.map((category) => (
            <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
