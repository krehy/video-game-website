import React from 'react';

const RollButton = ({ onRoll, disabled, rollCount }) => (
  <button
    onClick={onRoll}
    disabled={disabled}
    className={`mt-4 px-4 py-2 rounded ${
      disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
    }`}
  >
    Hodit kostkami ({rollCount}/3)
  </button>
);

export default RollButton;
