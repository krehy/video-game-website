// src/components/BackgroundIcons.tsx
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faLaptop, faKeyboard, faHeadset, faMouse } from '@fortawesome/free-solid-svg-icons';

const icons = [faGamepad, faLaptop, faHeadset, faMouse, faKeyboard];

const getPosition = (row, col, iconSize) => ({
  top: `${row * iconSize * 1.5}px`,
  left: `${col * iconSize * 1.5}px`,
});

const getRotation = () => `rotate(${Math.floor(Math.random() * 360)}deg)`;

const BackgroundIcons = () => {
  const [dimensions, setDimensions] = useState({ numRows: 0, numCols: 0 });
  const rotationsRef = useRef<string[][]>([]);

  useEffect(() => {
    const iconSize = 48; // Icon size in pixels
    const handleResize = () => {
      const numCols = Math.ceil(window.innerWidth / (iconSize * 1.5));
      const numRows = Math.ceil(document.documentElement.scrollHeight / (iconSize * 1.5));
      setDimensions({ numRows, numCols });

      // Initialize rotations for all rows and columns
      const newRotations = Array.from({ length: numRows }, (_, rowIndex) => 
        Array.from({ length: numCols }, (_, colIndex) => {
          return rotationsRef.current[rowIndex]?.[colIndex] || getRotation();
        })
      );
      rotationsRef.current = newRotations;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { numCols, numRows } = dimensions;
  const iconSize = 48; // Icon size in pixels

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: numRows }).map((_, rowIndex) => (
        Array.from({ length: numCols }).map((_, colIndex) => (
          <FontAwesomeIcon
            icon={icons[(rowIndex + colIndex) % icons.length]}
            key={`${rowIndex}-${colIndex}`}
            style={{
              position: 'absolute',
              ...getPosition(rowIndex, colIndex, iconSize),
              transform: rotationsRef.current[rowIndex][colIndex],
              opacity: 0.1,
              fontSize: `${iconSize}px`,
              color: '#000',
            }}
          />
        ))
      ))}
    </div>
  );
};

export default BackgroundIcons;
