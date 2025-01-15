import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGameContext } from '../../../contexts/GameContext';
import { useSocket } from '../../../contexts/SocketContext';

const GameLobby = () => {
  const router = useRouter();
  const { nickname, setNickname, setOpponent } = useGameContext();
  const socket = useSocket();
  const [localNickname, setLocalNickname] = useState<string>('');
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [rooms, setRooms] = useState<{ id: string; nickname: string }[]>([]);
  const [isRoomOwner, setIsRoomOwner] = useState<boolean>(false);
  const [joinRequest, setJoinRequest] = useState<{ id: string; nickname: string } | null>(null);

  useEffect(() => {
    if (!socket) {
      console.error('Socket není inicializován!');
      return;
    }

    socket.on('update-rooms', (rooms: { id: string; nickname: string }[]) => setRooms(rooms));
    socket.on('join-request', (data: { id: string; nickname: string }) => setJoinRequest(data));
    socket.on('join-accepted', ({ hostNickname, playerNickname }: { hostNickname: string; playerNickname: string }) => {
      setNickname(playerNickname);
      setOpponent(hostNickname);
      router.push('/yazy/game');
    });
    socket.on('start-game-ready', ({ hostNickname, playerNickname }: { hostNickname: string; playerNickname: string }) => {
      setNickname(hostNickname);
      setOpponent(playerNickname);
      router.push('/yazy/game');
    });
    socket.on('join-declined', () => alert('Tvoje žádost byla odmítnuta.'));

    return () => {
      socket.off('update-rooms');
      socket.off('join-request');
      socket.off('join-accepted');
      socket.off('start-game-ready');
      socket.off('join-declined');
    };
  }, [socket, router, setNickname, setOpponent]);

  const handleLogin = () => {
    if (!localNickname.trim()) {
      alert('You must enter a nickname!');
      return;
    }
    setNickname(localNickname);
    setIsLogged(true);
  };

  const handleCreateRoom = () => {
    if (socket) {
      setIsRoomOwner(true);
      socket.emit('create-room', { nickname });
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-room', { roomId, nickname });
    }
  };

  const handleAcceptRequest = () => {
    if (socket && joinRequest) {
      socket.emit('accept-request', {
        id: joinRequest.id,
        nickname: joinRequest.nickname,
        hostNickname: nickname,
      });
      setJoinRequest(null);
    }
  };

  const handleDeclineRequest = () => {
    if (socket && joinRequest) {
      socket.emit('decline-request', { id: joinRequest.id });
      setJoinRequest(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white">
      {isLogged && (
        <div className="absolute top-4 left-4 text-lg font-bold">
          Přihlášen jako: {nickname}
        </div>
      )}

      <div className="w-full max-w-md bg-[#2a2a2a] p-6 rounded-lg shadow-lg text-center">
        {!isLogged ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Zadej svůj nick</h1>
            <input
              type="text"
              value={localNickname}
              onChange={(e) => setLocalNickname(e.target.value)}
              placeholder="Zadej svůj nick"
              className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-600 bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#8e67ea]"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#8e67ea] hover:bg-[#764bb5] text-white px-4 py-2 rounded-lg transition"
            >
              Pokračovat
            </button>
          </>
        ) : (
          <>
            {!isRoomOwner && (
              <button
                onClick={handleCreateRoom}
                className="w-full bg-[#8e67ea] hover:bg-[#764bb5] text-white px-4 py-2 rounded-lg transition mb-6"
              >
                Vytvořit místnost
              </button>
            )}

            <h2 className="text-xl font-semibold mb-4">Dostupné místnosti:</h2>
            <ul className="space-y-4">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex justify-between items-center bg-[#3a3a3a] px-4 py-2 rounded-lg"
                >
                  <span>{room.nickname} (Hostitel)</span>
                  {room.id === socket?.id ? (
                    <span className="text-green-400 font-semibold">Toto je vaše místnost</span>
                  ) : (
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="bg-[#8e67ea] hover:bg-[#764bb5] text-white px-4 py-2 rounded-lg transition"
                    >
                      Připojit se
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {rooms.length === 0 && (
              <p className="text-gray-400">Žádné místnosti nejsou k dispozici.</p>
            )}
          </>
        )}
      </div>

      {joinRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              {joinRequest.nickname} se chce připojit k tvé místnosti.
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAcceptRequest}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Přijmout
              </button>
              <button
                onClick={handleDeclineRequest}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Odmítnout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLobby;
