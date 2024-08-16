import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ProductList from './ProductList';
import ProductFilter from './ProductFilter';
import { sortProducts } from './SortProducts';

const ProductIndex = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    priceRange: [0, 10000],
    sortBy: 'newest',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSliderChange = (value) => {
    setFilters({
      ...filters,
      priceRange: value,
    });
  };

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesTitle = filters.title
        ? product.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;

      const matchesPriceRange = product.variants.edges.some(
        (variant) =>
          parseFloat(variant.node.priceV2.amount) >= filters.priceRange[0] &&
          parseFloat(variant.node.priceV2.amount) <= filters.priceRange[1]
      );

      return matchesTitle && matchesPriceRange;
    });

    filtered = sortProducts(filtered, filters.sortBy);

    setFilteredProducts(filtered);
  }, [filters, products]);

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Eshop</title>
      </Head>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Eshop</h1>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="relative flex items-center text-[#8e67ea] focus:outline-none group"
        >
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
            Filtrovat
          </span>
          <FontAwesomeIcon icon={faFilter} className="text-2xl ml-2" />
        </button>
      </div>

      <ProductFilter
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleSliderChange={handleSliderChange}
        showFilter={showFilter}
      />

      {filteredProducts.length > 0 ? (
        <ProductList products={filteredProducts} />
      ) : (
        <div className="text-center text-gray-500 text-xl">
          Žádné produkty nejsou momentálně k dispozici.
        </div>
      )}
    </div>
  );
};

export default ProductIndex;
