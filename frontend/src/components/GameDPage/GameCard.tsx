import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const GameCard = ({ game }) => {
  return (
    <div key={game.slug} className="bg-white shadow-md rounded overflow-hidden relative">
      {game.main_image && (
        <div className="relative">
          <img
            src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`}
            alt={game.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
            <Link href={`/games/${game.slug}`}>
              <h2 className="text-lg font-semibold">{game.title}</h2>
            </Link>
          </div>
        </div>
      )}
      <div className="p-4">
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
        <p className="text-gray-700 mb-4 break-words" dangerouslySetInnerHTML={{ __html: game.description }}></p>
        <div className="flex flex-wrap">
          {game.genres.map((genre) => (
            <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {genre.name}
            </span>
          ))}
          {game.platforms.map((platform) => (
            <span key={platform.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {platform.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
