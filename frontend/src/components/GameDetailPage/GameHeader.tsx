import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { GameHeaderProps } from '../../types';  // Import typů z types.tsx

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => (
  <div className="relative mb-4">
    <Image
      src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`}
      alt={game.title}
      layout="responsive"
      width={1200} // Set according to your design requirements
      height={600} // Set according to your design requirements
      objectFit="cover"
      className="rounded"
    />
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
      <div className="flex items-center text-sm mb-2">
        <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
        <span className="mr-4">{game.developer ? game.developer.name : 'Unknown Developer'}</span>
        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-[#8e67ea] text-lg" />
        <span className="mr-4">{game.publisher ? game.publisher.name : 'Unknown Publisher'}</span>
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
        <span>{new Date(game.release_date).toLocaleDateString()}</span>
      </div>
      <div className="flex flex-wrap">
        {game.genres.map((genre) => (
          <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {genre.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default GameHeader;
