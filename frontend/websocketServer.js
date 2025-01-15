const { Server } = require('socket.io');

const PORT = 4000;
const io = new Server(PORT, {
  cors: {
    origin: '*',
  },
});

let rooms = [];
let gameStates = {};

io.on('connection', (socket) => {
  console.log(`Hráč připojen: ${socket.id}`);

  socket.on('create-room', ({ nickname }) => {
    const room = { id: socket.id, nickname };
    rooms.push(room);
    io.emit('update-rooms', rooms);
    console.log(`Místnost vytvořena hostitelem: ${nickname}`);
  });

  socket.on('join-room', ({ roomId, nickname }) => {
    console.log(`Žádost o připojení od hráče "${nickname}" do místnosti ${roomId}`);
    io.to(roomId).emit('join-request', { id: socket.id, nickname });
  });

  socket.on('accept-request', ({ id, nickname, hostNickname }) => {
    const roomId = socket.id;
  
    const startingPlayer = Math.random() < 0.5 ? hostNickname : nickname;
  
    gameStates[roomId] = {
      host: { nickname: hostNickname, socketId: roomId },
      player: { nickname, socketId: id },
      currentTurn: startingPlayer,
    };
  
    console.log(`Hra začíná. Na tahu: ${startingPlayer}`);
  
    // Host obdrží informace o sobě a soupeři
    io.to(roomId).emit('start-game-ready', {
      role: 'host',
      nickname: hostNickname,
      opponent: nickname,
      currentTurn: startingPlayer,
    });
  
    // Player obdrží informace o sobě a soupeři
    io.to(id).emit('start-game-ready', {
      role: 'player',
      nickname: nickname,
      opponent: hostNickname,
      currentTurn: startingPlayer,
    });
  });

  socket.on('end-turn', ({ nickname }) => {
    const roomId = Object.keys(gameStates).find(
      (id) =>
        gameStates[id]?.host.socketId === socket.id ||
        gameStates[id]?.player.socketId === socket.id
    );

    if (roomId) {
      const gameState = gameStates[roomId];
      const nextTurn =
        gameState.currentTurn === gameState.host.nickname
          ? gameState.player.nickname
          : gameState.host.nickname;

      gameStates[roomId].currentTurn = nextTurn;

      io.to(roomId).emit('switch-turn', { nextTurn });
    }
  });

  socket.on('roll-dice', ({ nickname, dice }) => {
    const roomId = Object.keys(gameStates).find(
      (id) =>
        gameStates[id]?.host.socketId === socket.id ||
        gameStates[id]?.player.socketId === socket.id
    );

    if (roomId) {
      const gameState = gameStates[roomId];
      const opponentSocket =
        gameState.host.socketId === socket.id
          ? gameState.player.socketId
          : gameState.host.socketId;

      socket.to(opponentSocket).emit('opponent-roll', { dice });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Hráč odpojen: ${socket.id}`);

    const roomId = Object.keys(gameStates).find(
      (id) =>
        gameStates[id]?.host.socketId === socket.id ||
        gameStates[id]?.player.socketId === socket.id
    );

    if (roomId) {
      const gameState = gameStates[roomId];
      const remainingPlayer =
        gameState.host.socketId === socket.id
          ? gameState.player.socketId
          : gameState.host.socketId;

      io.to(remainingPlayer).emit('player-disconnected');
      delete gameStates[roomId];
    }

    rooms = rooms.filter((room) => room.id !== socket.id);
    io.emit('update-rooms', rooms);
  });
});

console.log(`WebSocket server běží na portu ${PORT}`);
