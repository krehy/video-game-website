import React, { useMemo } from 'react';

interface ScoreTableProps {
  dice: number[];
  opponentDice: number[];
  usedCombinations: boolean[];
  opponentUsedCombinations: boolean[];
  playerScores: (number | null)[];
  opponentScores: (number | null)[];
  onSelectScore: (index: number) => void;
  isTurn: boolean;
}

const ScoreTable: React.FC<ScoreTableProps> = ({
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
        calculate: (dice: number[]) => dice.filter((d) => d === 1).reduce((a, b) => a + b, 0),
      },
      {
        name: 'Dvojky',
        calculate: (dice: number[]) => dice.filter((d) => d === 2).reduce((a, b) => a + b, 0),
      },
      // Další kombinace...
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
              <td className="px-4 py-2 bg-[#3a3a3a]">{comb.name}</td>
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
