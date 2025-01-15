import React from 'react';
import { SocketProvider } from '../../contexts/SocketContext';
import { GameProvider } from '../../contexts/GameContext';

const YazyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketProvider>
      <GameProvider>
        {children}
      </GameProvider>
    </SocketProvider>
  );
};

export default YazyLayout;
