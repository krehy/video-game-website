import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

let socketInstance: Socket | null = null; // Singleton pro socket připojení

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socket = useRef<Socket | null>(null);

  if (!socketInstance) {
    socketInstance = io('http://localhost:4000'); // Jediná inicializace socketu
    console.log('Socket připojen:', socketInstance.id);
  }

  useEffect(() => {
    socket.current = socketInstance;

    if (socket.current) {
      socket.current.on('connect', () => {
        console.log('WebSocket připojen:', socket.current?.id);
      });

      socket.current.on('disconnect', () => {
        console.log('WebSocket odpojen:', socket.current?.id);
      });
    }

    return () => {
      console.log('WebSocket odpojován');
      socket.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket musí být použito uvnitř SocketProvideru');
  }
  return socket;
};
