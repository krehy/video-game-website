import React, { createContext, useContext, useState } from 'react';

interface GameContextProps {
  nickname: string;
  opponent: string;
  setNickname: (nickname: string) => void;
  setOpponent: (opponent: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nickname, setNickname] = useState('');
  const [opponent, setOpponent] = useState('');

  return (
    <GameContext.Provider value={{ nickname, opponent, setNickname, setOpponent }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
