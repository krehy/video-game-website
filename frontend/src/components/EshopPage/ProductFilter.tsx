import { motion } from 'framer-motion';
import { Range } from 'react-range';
import '../../styles/slider.css';

const ProductFilter = ({ filters, handleFilterChange, handleSliderChange, showFilter }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: showFilter ? 'auto' : 0, opacity: showFilter ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      <div className="bg-white p-4 shadow-md rounded mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Hledat podle názvu
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={filters.title}
            onChange={handleFilterChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Zadejte název produktu"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Cena</label>
          <Range
            values={filters.priceRange}
            step={1}
            min={Math.min(...filters.priceRange)}
            max={Math.max(...filters.priceRange)}
            onChange={handleSliderChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                key={props.key}  // Explicitně předaný key prop
                className="w-full h-2 bg-[#ddd]"
                style={{ position: 'relative', background: '#ddd' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    height: '100%',
                    background: '#8e67ea',
                    left: `${((filters.priceRange[0] - Math.min(...filters.priceRange)) / (Math.max(...filters.priceRange) - Math.min(...filters.priceRange))) * 100}%`,
                    right: `${100 - ((filters.priceRange[1] - Math.min(...filters.priceRange)) / (Math.max(...filters.priceRange) - Math.min(...filters.priceRange))) * 100}%`,
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                key={props.key}  // Explicitně předaný key prop
                className={`h-4 w-4 rounded-full bg-[#8e67ea] shadow ${isDragged ? 'shadow-lg' : 'shadow'}`}
              />
            )}
          />
          <div className="flex justify-between text-gray-700 mt-2">
            <span>Od: {filters.priceRange[0]} Kč</span>
            <span>Do: {filters.priceRange[1]} Kč</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFilter;
