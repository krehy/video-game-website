import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { ArticleHeaderProps } from '../../types';

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article, readCount, isDarkMode }) => (
  <>
    <h1 style={{color:'white'}} className="text-3xl font-bold mb-4">{article.title}</h1>

    {article.main_image && (
      <div className="relative mb-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
          alt={article.title}
          width={1920} // Vyšší šířka pro lepší rozlišení
          height={1080} // Poměr stran 16:9
          className="rounded object-cover w-full h-auto"
          priority
        />

        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
          <p className="mb-2">{article.intro}</p>
          <div className="flex items-center text-sm mb-2">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
            <Link href={`/profile/${article.owner.username}`} className="mr-4 text-[#8e67ea] hover:underline">
              {article.owner.username}
            </Link>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
            <span className="mr-6">{new Date(article.first_published_at).toLocaleDateString()}</span> 
            <FontAwesomeIcon icon={faEye} className="mr-2 text-[#8e67ea] text-lg" />
            <span>{readCount}</span>
          </div>
          <div className="flex flex-wrap">
            {article.categories.map((category) => (
              <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
    {/* Intro text below image for mobile */}
    <div className="block md:hidden p-4 bg-black bg-opacity-50 text-white rounded mb-4">
      <p className="mb-2">{article.intro}</p>
      <div className="flex items-center text-sm mb-2">
        <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
        <Link href={`/profile/${article.owner.username}`} className="mr-4 text-[#8e67ea] hover:underline">
          {article.owner.username}
        </Link>
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
        <span className="mr-2">{new Date(article.first_published_at).toLocaleDateString()}</span> 
        <FontAwesomeIcon icon={faEye} className=" text-[#8e67ea] text-lg" />
        <span>{readCount}</span>
      </div>
      <div className="flex flex-wrap">
        {article.categories.map((category) => (
          <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {category.name}
          </span>
        ))}
      </div>
    </div>
  </>
);

export default ArticleHeader;
