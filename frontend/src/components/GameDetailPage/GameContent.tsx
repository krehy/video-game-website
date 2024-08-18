import React from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { GameContentProps } from '../../types';  // Import typu z types.tsx

const GameContent: React.FC<GameContentProps> = ({ game, isDarkMode }) => {
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'media') {
        return (
          <div key={domNode.attribs.url} className="video-container">
            <iframe
              width="560"
              height="315"
              src={domNode.attribs.url.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'image') {
        const imageUrl = `${process.env.NEXT_PUBLIC_INDEX_URL}/media/original_images/${domNode.attribs.alt}.jpg`;

        return (
          <Image
            key={domNode.attribs.id}
            src={imageUrl}
            alt={domNode.attribs.alt}
            width={800} // Set this to the appropriate value based on your design
            height={600} // Set this to the appropriate value based on your design
            layout="responsive"
            objectFit="cover"
            className={`embedded-image ${domNode.attribs.format}`}
          />
        );
      }
    },
  };

  return (
    <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
      {game.description ? parse(game.description, options) : 'No content available'}
    </div>
  );
};

export default GameContent;
