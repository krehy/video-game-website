import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import { useGameContext } from '../../../contexts/GameContext';
import DiceDisplay from './GameBoard/DiceDisplay';
import ScoreTable from './GameBoard/ScoreTable';
import RollButton from './GameBoard/RollButton';
import GameInfo from './GameBoard/GameInfo';
import { useRouter } from 'next/router';

const GameBoard = () => {
  const { nickname } = useGameContext();
  const socket = useSocket();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null); // Role hráče: host nebo player
  const [opponent, setOpponent] = useState<string | null>(null);
  const [myDice, setMyDice] = useState<number[]>([1, 1, 1, 1, 1]);
  const [opponentDice, setOpponentDice] = useState<number[]>([1, 1, 1, 1, 1]);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [rollCount, setRollCount] = useState(0);
  const [usedCombinations, setUsedCombinations] = useState<boolean[]>([]);
  const [opponentUsedCombinations, setOpponentUsedCombinations] = useState<boolean[]>([]);
  const [playerScores, setPlayerScores] = useState<(number | null)[]>([]);
  const [opponentScores, setOpponentScores] = useState<(number | null)[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('start-game-ready', ({ role, opponent, currentTurn }) => {
      setRole(role);
      setOpponent(opponent);
      setCurrentTurn(currentTurn);
    });

    socket.on('switch-turn', ({ nextTurn }) => {
      setCurrentTurn(nextTurn);
      setRollCount(0);
    });

    socket.on('opponent-roll', ({ dice }) => {
      setOpponentDice(dice);
    });

    socket.on('update-score', ({ playerScore, opponentScore, usedComb, opponentUsedComb }) => {
      setPlayerScores(playerScore);
      setOpponentScores(opponentScore);
      setUsedCombinations(usedComb);
      setOpponentUsedCombinations(opponentUsedComb);
    });

    return () => {
      socket.off('start-game-ready');
      socket.off('switch-turn');
      socket.off('opponent-roll');
      socket.off('update-score');
    };
  }, [socket]);

  const totalPlayerScore = (playerScores || [])
  .filter((score): score is number => score !== null) // Odstraníme null hodnoty
  .reduce((a, b) => a + b, 0);

  const totalOpponentScore = (opponentScores || [])
  .filter((score): score is number => score !== null) // Odstraníme null hodnoty
  .reduce((a, b) => a + b, 0);

  const handleRollDice = () => {
    if (rollCount < 3 && currentTurn === nickname) {
      const newDice = myDice.map(() => Math.floor(Math.random() * 6) + 1);
      setMyDice(newDice);
      setRollCount((prev) => prev + 1);
      socket.emit('roll-dice', { nickname, dice: newDice });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center p-4">
<GameInfo
  currentTurn={currentTurn || ''} // Přidání currentTurn s výchozí hodnotou
  nickname={nickname}
  opponent={opponent || 'Soupeř'}
  score={totalPlayerScore}
  opponentScore={totalOpponentScore}
/>

      <DiceDisplay title={`Kostky soupeře (${opponent}):`} dice={opponentDice} />
      <ScoreTable
        dice={myDice}
        opponentDice={opponentDice}
        usedCombinations={usedCombinations}
        opponentUsedCombinations={opponentUsedCombinations}
        playerScores={playerScores}
        opponentScores={opponentScores}
        onSelectScore={(index) => {
          const newUsedCombinations = [...usedCombinations];
          newUsedCombinations[index] = true;
          setUsedCombinations(newUsedCombinations);

          const newPlayerScores = [...playerScores];
          newPlayerScores[index] = Math.floor(Math.random() * 30); // Dummy calculation
          setPlayerScores(newPlayerScores);

          socket.emit('select-score', { nickname, index });
        }}
        isTurn={currentTurn === nickname}
      />
      <DiceDisplay title={`Tvoje kostky (${nickname}):`} dice={myDice} />
      <RollButton
  onRoll={handleRollDice}
  disabled={currentTurn !== nickname || rollCount >= 3}
  rollCount={rollCount} // Přidání chybějícího prop
/>
    </div>
  );
};

export default GameBoard;
