import React, { useMemo } from 'react';

const ScoreTable = ({
  dice = [],
  opponentDice = [],
  usedCombinations = [],
  opponentUsedCombinations = [],
  playerScores = [],
  opponentScores = [],
  onSelectScore,
  isTurn,
}) => {
  // Definice kombinací
  const combinations = useMemo(
    () => [
      {
        name: 'Jedničky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 1).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Dvojky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 2).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Trojky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 3).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Čtyřky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 4).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Pětky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 5).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Šestky',
        calculate: (dice) => (Array.isArray(dice) ? dice.filter((d) => d === 6).reduce((a, b) => a + b, 0) : 0),
      },
      {
        name: 'Trojice',
        calculate: (dice) => {
          if (!Array.isArray(dice)) return 0;
          const counts = dice.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});
          return Object.values(counts).some((count) => count >= 3) ? dice.reduce((a, b) => a + b, 0) : 0;
        },
      },
      {
        name: 'Čtveřice',
        calculate: (dice) => {
          if (!Array.isArray(dice)) return 0;
          const counts = dice.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});
          return Object.values(counts).some((count) => count >= 4) ? dice.reduce((a, b) => a + b, 0) : 0;
        },
      },
      {
        name: 'Full House',
        calculate: (dice) => {
          if (!Array.isArray(dice)) return 0;
          const counts = dice.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});
          const values = Object.values(counts);
          return values.includes(3) && values.includes(2) ? 25 : 0;
        },
      },
      {
        name: 'Postupka',
        calculate: (dice) => {
          if (!Array.isArray(dice)) return 0;
          const unique = [...new Set(dice)].sort();
          const straight = [1, 2, 3, 4, 5];
          return straight.every((val) => unique.includes(val)) ? 40 : 0;
        },
      },
      {
        name: 'Yatzy',
        calculate: (dice) => {
          if (!Array.isArray(dice)) return 0;
          const counts = dice.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
          }, {});
          return Object.values(counts).some((count) => count === 5) ? 50 : 0;
        },
      },
    ],
    []
  );

  // Výpočet možných skóre
  const possibleScores = useMemo(() => combinations.map((comb) => comb.calculate(dice)), [dice, combinations]);
  const opponentPossibleScores = useMemo(
    () => combinations.map((comb) => comb.calculate(opponentDice)),
    [opponentDice, combinations]
  );

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Tabulka skóre</h3>
      <table className="w-full text-left bg-[#2a2a2a] rounded divide-y divide-gray-600">
        <tbody>
          {combinations.map((comb, idx) => (
            <tr
              key={idx}
              onClick={() => isTurn && !usedCombinations[idx] && onSelectScore(idx)}
              className={`cursor-pointer ${
                isTurn && !usedCombinations[idx] ? 'hover:bg-[#3a3a3a]' : ''
              }`}
            >
              {/* Název kombinace */}
              <td className="px-4 py-2 bg-[#3a3a3a]">{comb.name}</td>

              {/* Skóre hráče */}
              <td
                className={`px-4 py-2 bg-[#2d2d2d] ${
                  isTurn && !usedCombinations[idx] ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {usedCombinations[idx]
                  ? playerScores[idx] ?? '-'
                  : isTurn
                  ? possibleScores[idx] ?? '-'
                  : '-'}
              </td>

              {/* Skóre soupeře */}
              <td className="px-4 py-2 bg-[#2a2a2a] text-gray-400">
                {opponentUsedCombinations[idx]
                  ? opponentScores[idx] ?? '-'
                  : opponentPossibleScores[idx] ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
