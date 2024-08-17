import React from 'react';
import { Range } from 'react-range';

const GameFilters = ({ filters, handleFilterChange, handleCheckboxChange, handleSliderChange, developers, publishers, genres, platforms, dateRange, minDate, maxDate, formatDate }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded mb-4">
      {/* Input pro název hry */}
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
      {/* Vývojář */}
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
      {/* Vydavatel */}
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
      {/* Žánr */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
          Žánr
        </label>
        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {genres.map((genre, index) => (
            <div key={index} className="mb-2">
              <input
                type="checkbox"
                id={`genre-${index}`}
                name="genres"
                value={genre}
                checked={filters.genres.includes(genre)}
                onChange={handleCheckboxChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor={`genre-${index}`}>{genre}</label>
            </div>
          ))}
        </div>
      </div>
      {/* Platforma */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platform">
          Platforma
        </label>
        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {platforms.map((platform, index) => (
            <div key={index} className="mb-2">
              <input
                type="checkbox"
                id={`platform-${index}`}
                name="platforms"
                value={platform}
                checked={filters.platforms.includes(platform)}
                onChange={handleCheckboxChange}
                className="mr-2 leading-tight"
              />
              <label htmlFor={`platform-${index}`}>{platform}</label>
            </div>
          ))}
        </div>
      </div>
      {/* Datum vydání */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Datum vydání
        </label>
        <Range
          values={filters.dateRange}
          step={86400000} // Jeden den v milisekundách
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
