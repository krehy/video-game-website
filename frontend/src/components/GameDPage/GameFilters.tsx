import React, { useState } from 'react';
import { Range } from 'react-range';
import { GameFiltersProps } from '../../types';

const GameFilters: React.FC<GameFiltersProps> = ({
  filters,
  setFilters,
  developers,
  publishers,
  genres,
  platforms,
  minDate,
  maxDate,
  formatDate
}) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
  
    setFilters((prevFilters) => {
      const key = name as keyof typeof filters; // Typování klíče
      const updatedValues = checked
        ? [...(prevFilters[key] as string[]), value] // Přidat hodnotu
        : (prevFilters[key] as string[]).filter((item) => item !== value); // Odebrat hodnotu
  
      return {
        ...prevFilters,
        [key]: updatedValues,
      };
    });
  };
  
  
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        dateRange: values as [number, number], // Přesně definujeme tuple
      }));
    }
  };
  
  return (
    <div className="bg-white p-4 shadow-md rounded mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Hledat
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={filters.title}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Zadejte název hry"
          autoFocus
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="developer">
          Vývojář
        </label>
        <select
          name="developer"
          id="developer"
          value={filters.developer}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Všichni vývojáři</option>
          {developers.map((developer, index) => (
            <option key={index} value={developer}>{developer}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
          Vydavatel
        </label>
        <select
          name="publisher"
          id="publisher"
          value={filters.publisher}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Všichni vydavatelé</option>
          {publishers.map((publisher, index) => (
            <option key={index} value={publisher}>{publisher}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
    Žánr
  </label>
  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex flex-wrap gap-2">
    {genres.map((genre, index) => (
      <label key={index} className="inline-flex items-center">
        <input
          type="checkbox"
          name="genres"
          value={genre}
          checked={filters.genres.includes(genre)}
          onChange={handleCheckboxChange}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-gray-700">{genre}</span>
      </label>
    ))}
  </div>
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platforms">
    Platforma
  </label>
  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex flex-wrap gap-2">
    {platforms.map((platform, index) => (
      <label key={index} className="inline-flex items-center">
        <input
          type="checkbox"
          name="platforms"
          value={platform}
          checked={filters.platforms.includes(platform)}
          onChange={handleCheckboxChange}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
        <span className="ml-2 text-gray-700">{platform}</span>
      </label>
    ))}
  </div>
</div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Datum vydání
        </label>
        <Range
          values={filters.dateRange}
          step={86400000}
          min={minDate ? minDate.getTime() : 0}
          max={maxDate ? maxDate.getTime() : 100}
          onChange={handleSliderChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-2 bg-[#ddd]"
              style={{ position: 'relative', background: '#ddd' }}
            >
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  background: '#8e67ea',
                  left: `${((filters.dateRange[0] - (minDate ? minDate.getTime() : 0)) / ((maxDate ? maxDate.getTime() : 100) - (minDate ? minDate.getTime() : 0))) * 100}%`,
                  right: `${100 - ((filters.dateRange[1] - (minDate ? minDate.getTime() : 0)) / ((maxDate ? maxDate.getTime() : 100) - (minDate ? minDate.getTime() : 0))) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              className={`h-4 w-4 rounded-full bg-[#8e67ea] shadow ${isDragged ? 'shadow-lg' : 'shadow'}`}
            />
          )}
        />
        <div className="flex justify-between text-gray-700 mt-2">
          <span>Od: {formatDate(filters.dateRange[0])}</span>
          <span>Do: {formatDate(filters.dateRange[1])}</span>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;
