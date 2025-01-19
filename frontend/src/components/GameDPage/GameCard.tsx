import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faCalendarAlt, faComputerMouse, faGamepad, faMobile, faVrCardboard } from '@fortawesome/free-solid-svg-icons';
import { faXbox, faPlaystation } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Game } from '../../types';

const platformIcons = {
  PC: { icon: faComputerMouse },
  Xbox: { icon: faXbox },
  PlayStation: { icon: faPlaystation },
  Nintendo: { icon: faGamepad },
  Mobile: { icon: faMobile },
  VR: { icon: faVrCardboard },
  Other: { icon: faGamepad },
};

const GameCard: React.FC<{ game: Game; info?: boolean }> = ({ game, info = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncatedDescription = game.description.length > 200 
    ? `${game.description.substring(0, 200)}...` 
    : game.description;

    const platformGroups = (game.platforms || []).reduce<Record<string, string[]>>((acc, platform) => {
      if (['Windows', 'Linux', 'macOS'].includes(platform.name)) {
        acc.PC = acc.PC || [];
        acc.PC.push(platform.name);
      } else if (platform.name.includes('Xbox')) {
        acc.Xbox = acc.Xbox || [];
        acc.Xbox.push(platform.name);
      } else if (platform.name.includes('PlayStation') && platform.name !== 'PlayStation VR') {
        acc.PlayStation = acc.PlayStation || [];
        acc.PlayStation.push(platform.name);
      } else if (['iOS (iPhone, iPad)', 'Android'].includes(platform.name)) {
        acc.Mobile = acc.Mobile || [];
        acc.Mobile.push(platform.name);
      } else if (['Meta Quest 2', 'Meta Quest Pro', 'PlayStation VR', 'HTC Vive', 'Valve Index'].includes(platform.name)) {
        acc.VR = acc.VR || [];
        acc.VR.push(platform.name);
      } else {
        acc.Other = acc.Other || [];
        acc.Other.push(platform.name);
      }
      return acc;
    }, {});
    
  const imageUrl = game.main_image
    ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`
    : '';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white shadow-md rounded overflow-hidden flex flex-col md:flex-row md:max-w-4xl w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="relative w-full md:w-1/3 h-64 md:h-auto flex-shrink-0">
          <Link href={`/games/${game.slug}`}>
              <Image
                src={imageUrl}
                alt={game.title}
                fill
                objectFit="cover"
                className="rounded-t md:rounded-t-none md:rounded-l"
              />
          </Link>
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
          <p
            className="text-gray-700 mb-4 break-words"
            dangerouslySetInnerHTML={{ __html: truncatedDescription }}
          ></p>
                  <div className="flex flex-wrap">
                  {Object.entries(platformGroups).map(([key, platforms]) => {
  const platformData = platformIcons[key as keyof typeof platformIcons] || platformIcons.Other;
  const title = platforms.join(', ');
  return (
    <div
      key={key}
      className="flex items-center justify-center bg-gray-200 rounded-full w-10 h-10 mr-2 mb-2 text-gray-700 cursor-pointer"
      title={title}
    >
      <FontAwesomeIcon icon={platformData.icon} className="text-lg" />
    </div>
  );
})}
        </div>
          {truncatedDescription.length > 200 && (
            <Link href={`/games/${game.slug}`}>
              <span className="text-[#8e67ea] font-semibold">Zjistit o hře víc</span>
            </Link>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default GameCard;
