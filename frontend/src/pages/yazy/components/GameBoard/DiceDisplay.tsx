import React from 'react';

const DiceDisplay = ({ title, dice }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="flex space-x-2">
      {dice.map((die, idx) => (
        <div
          key={idx}
          className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center"
        >
          {die}
        </div>
      ))}
    </div>
  </div>
);

export default DiceDisplay;
