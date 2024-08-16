// components/IndexPage/ArticleCard.js
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';

const ArticleCard = ({ article }) => (
  <div className="bg-white shadow-md rounded overflow-hidden relative">
    {article.main_image && (
      <div className="relative">
        <img
          src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
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
        <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
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
  </div>
);

export default ArticleCard;
