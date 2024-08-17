import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const GameCard = ({ game, info }) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncatedDescription = game.description.length > 200 
    ? game.description.substring(0, 200) + "..."
    : game.description;

  // Determine the image source, prioritize `main_image`, fallback to `main_image_url`
  const imageUrl = game.main_image 
    ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}` 
    : `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image_url}`; // Prepend the base URL here

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      className="bg-white shadow-md rounded overflow-hidden flex flex-col md:flex-row md:max-w-4xl w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="relative w-full md:w-1/3">
          <Link href={`/games/${game.slug}`} legacyBehavior>
            <a>
              <img
                src={imageUrl} 
                alt={game.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </a>
          </Link>
          {isHovered && info && (
            <motion.div 
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
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
                Hra
              </p>
            </motion.div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col justify-between w-full md:w-2/3">
        <div>
          <Link href={`/games/${game.slug}`}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h2>
          </Link>
          <div className="flex flex-wrap text-gray-500 text-sm mb-4">
            {game.developer && (
              <div className="flex items-center mr-4 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
                <span>{game.developer.name}</span>
              </div>
            )}
            {game.publisher && (
              <div className="flex items-center mr-4 mb-2">
                <FontAwesomeIcon icon={faBuilding} className="mr-1 text-[#8e67ea]" />
                <span>{game.publisher.name}</span>
              </div>
            )}
            {game.release_date && (
              <div className="flex items-center mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
                <span>{new Date(game.release_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          <p className="text-gray-700 mb-4 break-words" dangerouslySetInnerHTML={{ __html: truncatedDescription }}></p>
          {truncatedDescription.length > 200 && (
            <Link href={`/games/${game.slug}`}>
              <span className="text-[#8e67ea] font-semibold">Zjistit o hře víc</span>
            </Link>
          )}
        </div>
        <div className="flex flex-wrap">
          {game.genres && Array.isArray(game.genres) && game.genres.map((genre) => (
            <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {genre.name}
            </span>
          ))}
          {game.platforms && Array.isArray(game.platforms) && game.platforms.map((platform) => (
            <span key={platform.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {platform.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
