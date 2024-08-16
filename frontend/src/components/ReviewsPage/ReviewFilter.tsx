import React from 'react';
import { Range } from 'react-range';

const reviewTypeTranslations = {
  'Game': 'Hra',
  'Keyboard': 'Klávesnice',
  'Mouse': 'Myš',
  'Monitor': 'Monitor',
  'Computer': 'Počítač',
  'Headphones': 'Sluchátka',
  'Console': 'Konzole',
  'Mobile': 'Mobil',
  'Notebook': 'Notebook',
  'Microphone': 'Mikrofon'
};

const ReviewFilters = ({
  filters,
  setFilters,
  reviewTypes,
  minDate,
  maxDate,
  dateRange,
  setDateRange,
  formatDate,
  handleFilterChange,
  handleSliderChange
}) => {
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
          placeholder="Zadejte název recenze"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reviewType">
          Recenze na
        </label>
        <select
          name="reviewType"
          id="reviewType"
          value={filters.reviewType}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Všechny typy</option>
          {reviewTypes.map((type, index) => (
            <option key={index} value={type}>{reviewTypeTranslations[type]}</option>
          ))}
        </select>
      </div>
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
              key={props.key} // Přidáno přímé přiřazení `key`
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
              key={props.key} // Přidáno přímé přiřazení `key`
              className={`h-4 w-4 rounded-full bg-[#8e67ea] shadow ${isDragged ? 'shadow-lg' : 'shadow'}`}
            />
          )}
        />
        <div className="flex justify-between text-gray-700 mt-2">
          <span>Od: {formatDate(filters.dateRange[0])}</span>
          <span>Do: {formatDate(filters.dateRange[1])}</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sortBy">
          Seřadit podle
        </label>
        <select
          name="sortBy"
          id="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="newest">Nejnovější</option>
          <option value="oldest">Nejstarší</option>
          <option value="mostRead">Nejvíce čtené</option>
          <option value="leastRead">Nejméně čtené</option>
          <option value="aToZ">A-Z</option>
          <option value="zToA">Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default ReviewFilters;
