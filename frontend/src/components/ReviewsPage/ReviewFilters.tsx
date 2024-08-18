import React from 'react';
import { Range } from 'react-range';
import { ReviewFiltersProps } from '../../types';

// Add the reviewTypeTranslations object with a defined type
const reviewTypeTranslations: { [key: string]: string } = {
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

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  filters,
  handleFilterChange,
  handleSliderChange,
  dateRange,
  categories,
  formatDate,
  minDate,
  maxDate
}) => {
  if (!filters) {
    return null; // or handle this case appropriately
  }

  // Handle minDate and maxDate being null
  const minTimestamp = minDate ? minDate.getTime() : 0;
  const maxTimestamp = maxDate ? maxDate.getTime() : Date.now();

  // Ensure dateRange values are within min and max bounds
  const validDateRange = [
    Math.max(minTimestamp, Math.min(dateRange[0], maxTimestamp)),
    Math.max(minTimestamp, Math.min(dateRange[1], maxTimestamp))
  ];

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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Kategorie
        </label>
        <select
          name="category"
          id="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Všechny kategorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {reviewTypeTranslations[category.name as keyof typeof reviewTypeTranslations] || category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Datum vydání
        </label>
        <Range
          values={validDateRange}
          step={86400000} // One day in milliseconds
          min={minTimestamp}
          max={maxTimestamp}
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
                  left: `${((validDateRange[0] - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%`,
                  right: `${100 - ((validDateRange[1] - minTimestamp) / (maxTimestamp - minTimestamp)) * 100}%`,
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
          <span>Od: {formatDate(validDateRange[0])}</span>
          <span>Do: {formatDate(validDateRange[1])}</span>
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
