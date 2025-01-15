import React from 'react';

interface GameInfoProps {
  currentTurn: string;
  nickname: string;
  opponent: string;
  score: number;
  opponentScore: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentTurn, nickname, opponent, score, opponentScore }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold mb-4">
      Na tahu: {currentTurn === nickname ? 'Ty' : opponent}
    </h2>
    <h3 className="text-lg font-bold">Tvoje skóre: {score}</h3>
    <h3 className="text-lg font-bold">Skóre soupeře: {opponentScore}</h3>
  </div>
);

export default GameInfo;
