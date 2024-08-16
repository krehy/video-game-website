import React from 'react';

const GameSchema = ({ game }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "image": game.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}` : '',
    "description": game.description,
    "author": {
      "@type": "Organization",
      "name": game.developer ? game.developer.name : 'Unknown Developer'
    },
    "publisher": {
      "@type": "Organization",
      "name": game.publisher ? game.publisher.name : 'Unknown Publisher'
    },
    "genre": game.genres.map(genre => genre.name),
    "gamePlatform": game.platforms.map(platform => platform.name)
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
  );
};

export default GameSchema;
