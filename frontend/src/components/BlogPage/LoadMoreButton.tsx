// src/components/BlogPage/LoadMoreButton.tsx

import React from 'react';
import { LoadMoreButtonProps } from '../../types';

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-center mt-4">
      <button onClick={onClick} className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-[#6b4ed8]">
        Načíst další
      </button>
    </div>
  );
};

export default LoadMoreButton;
