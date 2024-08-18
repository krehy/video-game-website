// src/components/CalendarPage/DarkModeToggle.tsx

import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { DarkModeToggleProps } from '../../types';

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      toggleDarkMode(savedMode === 'true');
    }
  }, [toggleDarkMode]); // Added toggleDarkMode to the dependency array

  const handleToggle = () => {
    toggleDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };
  
  return (
    <div className="absolute top-4 right-4 flex items-center">
      <FontAwesomeIcon icon={faSun} className={`mr-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          checked={isDarkMode}
          onChange={handleToggle}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          style={{ top: '-4px', left: isDarkMode ? '24px' : '4px' }}
        />
        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
      </div>
      <FontAwesomeIcon icon={faMoon} className={`ml-2 text-lg ${isDarkMode ? 'text-blue-500' : 'text-gray-400'}`} />
    </div>
  );
};

export default DarkModeToggle;
