import React from 'react';
import GameCard from './GameCard';

const GameList = ({ games }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {games.map(game => (
        <GameCard key={game.slug} game={game} />
      ))}
    </div>
  );
};

export default GameList;
