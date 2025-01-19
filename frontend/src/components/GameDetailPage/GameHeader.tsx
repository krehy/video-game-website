import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBuilding,
  faCalendarAlt,
  faComputerMouse,
  faGamepad,
  faMobile,
  faVrCardboard,
} from '@fortawesome/free-solid-svg-icons';
import { faXbox, faPlaystation } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import { GameHeaderProps } from '../../types';

const platformIcons = {
  PC: {
    icon: faComputerMouse,
  },
  Xbox: {
    icon: faXbox,
  },
  PlayStation: {
    icon: faPlaystation,
  },
  Nintendo: {
    icon: faGamepad,
  },
  Mobile: {
    icon: faMobile,
  },
  VR: {
    icon: faVrCardboard,
  },
  Other: {
    icon: faGamepad,
  },
};

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => {
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
    } else if (platform.name in platformIcons) {
      const key = platform.name as keyof typeof platformIcons;
      acc[key] = [platform.name];
    } else {
      acc.Other = acc.Other || [];
      acc.Other.push(platform.name);
    }
    return acc;
  }, {});

  return (
    <div className="relative mb-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`}
        alt={game.title}
        layout="responsive"
        width={1200}
        height={600}
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
        <div className="flex flex-wrap mb-2">
          {game.genres.map((genre) => (
            <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {genre.name}
            </span>
          ))}
        </div>
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
      </div>
    </div>
  );
};

export default GameHeader;
