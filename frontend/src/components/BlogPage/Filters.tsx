import React from 'react';
import { Range } from 'react-range';
import { ArticleFiltersProps } from '../../types';

const Filters: React.FC<ArticleFiltersProps> = ({
  categories,
  filters,
  handleFilterChange,
  handleSliderChange,
  dateRange,
  formatDate,
  minDate,
  maxDate
}) => (
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
        placeholder="Zadejte název článku"
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
          <option key={category.id} value={category.name}>{category.name}</option>
        ))}
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Datum vydání
      </label>
      <Range
        values={dateRange}
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
                left: `${((dateRange[0] - (minDate ? minDate.getTime() : 0)) / ((maxDate ? maxDate.getTime() : 100) - (minDate ? minDate.getTime() : 0))) * 100}%`,
                right: `${100 - ((dateRange[1] - (minDate ? minDate.getTime() : 0)) / ((maxDate ? maxDate.getTime() : 100) - (minDate ? minDate.getTime() : 0))) * 100}%`,
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
        <span>Od: {formatDate(dateRange[0])}</span>
        <span>Do: {formatDate(dateRange[1])}</span>
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

export default Filters;
