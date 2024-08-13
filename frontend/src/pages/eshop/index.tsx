import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchProducts, fetchProductIndexSEO } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'rc-slider/assets/index.css'; // Import default CSS for rc-slider
import '../../styles/slider.css'; // Import the custom CSS file for slider

// Dynamický import Slider komponenty s vypnutým SSR
const Slider = dynamic(() => import('rc-slider'), { ssr: false });

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [seoData, setSeoData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    priceRange: [0, 10000],
    category: 'Všechny kategorie',
    sortBy: 'newest',
  });
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [variantSelections, setVariantSelections] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      const productData = await fetchProducts();
      setProducts(productData);
      setFilteredProducts(productData);

      const prices = productData
        .map((product) => product.product_variants.map(variant => variant.price))
        .flat();
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setFilters({ ...filters, priceRange: [Math.min(...prices), Math.max(...prices)] });
      setPriceRange([Math.min(...prices), Math.max(...prices)]);

      const categoryList = [
        'Všechny kategorie',
        ...new Set(productData.flatMap((product) => product.categories.map((category) => category.name))),
      ];
      setCategories(categoryList);
    };

    const getSeoData = async () => {
      const seo = await fetchProductIndexSEO();
      setSeoData(seo);
    };

    getProducts();
    getSeoData();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesTitle = filters.title ? product.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesCategory =
        filters.category === 'Všechny kategorie'
          ? true
          : product.categories.some((category) => category.name === filters.category);
      const matchesPriceRange =
        filters.priceRange.length > 0 && product.product_variants.length > 0 
          ? product.product_variants.some(variant => variant.price >= filters.priceRange[0] && variant.price <= filters.priceRange[1])
          : true;
      return matchesTitle && matchesCategory && matchesPriceRange;
    });

    filtered = sortProducts(filtered, filters.sortBy);

    setFilteredProducts(filtered);
  }, [filters, products]);

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
    setPriceRange(value);
  };

  const handleVariantSelection = (productSlug, type, value) => {
    setVariantSelections((prevSelections) => ({
      ...prevSelections,
      [productSlug]: {
        ...prevSelections[productSlug],
        [type]: value,
      },
    }));
  };

  const sortProducts = (products, sortBy) => {
    switch (sortBy) {
      case 'newest':
        return products.sort((a, b) => new Date(b.first_published_at) - new Date(a.first_published_at));
      case 'oldest':
        return products.sort((a, b) => new Date(a.first_published_at) - new Date(b.first_published_at));
      case 'aToZ':
        return products.sort((a, b) => a.title.localeCompare(b.title));
      case 'zToA':
        return products.sort((a, b) => b.title.localeCompare(a.title));
      case 'priceLowToHigh':
        return products.sort((a, b) => Math.min(...a.product_variants.map(v => v.price)) - Math.min(...b.product_variants.map(v => v.price)));
      case 'priceHighToLow':
        return products.sort((a, b) => Math.max(...b.product_variants.map(v => v.price)) - Math.max(...a.product_variants.map(v => v.price)));
      default:
        return products;
    }
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Eshop',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/eshop`,
      },
    ],
  };

  const filteredProductsToShow =
    filters.category === 'Všechny kategorie'
      ? filteredProducts
      : filteredProducts.filter((product) =>
          product.categories.some((category) => category.name === filters.category)
        );

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Eshop'}</title>
        <meta name="description" content={seoData.search_description || 'Eshop page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Eshop'} />
        <meta property="og:description" content={seoData.search_description || 'Eshop page description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/eshop`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && (
          <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Eshop'} />
        <meta name="twitter:description" content={seoData.search_description || 'Eshop page description'} />
        {seoData.main_image && (
          <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Eshop</h1>
        <button onClick={() => setShowFilter(!showFilter)} className="relative flex items-center text-[#8e67ea] focus:outline-none group">
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
            Filtrovat
          </span>
          <FontAwesomeIcon icon={faFilter} className="text-2xl ml-2" />
        </button>
      </div>

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
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              defaultValue={priceRange}
              value={filters.priceRange}
              onChange={handleSliderChange}
              tipFormatter={(value) => `${value} Kč`}
              trackStyle={{ backgroundColor: '#8e67ea' }}
              handleStyle={[{ borderColor: '#8e67ea' }, { borderColor: '#8e67ea' }]}
              railStyle={{ backgroundColor: '#ddd' }}
            />
            <div className="flex justify-between text-gray-700 mt-2">
              <span>Od: {filters.priceRange[0]} Kč</span>
              <span>Do: {filters.priceRange[1]} Kč</span>
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
              <option value="priceLowToHigh">Cena vzestupně</option>
              <option value="priceHighToLow">Cena sestupně</option>
              <option value="aToZ">A-Z</option>
              <option value="zToA">Z-A</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <div className="flex space-x-4 mb-8 overflow-x-auto whitespace-nowrap">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              filters.category === category ? 'bg-[#8e67ea] text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => setFilters({ ...filters, category })}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid gap-8 grid-cols-1">
        {filteredProductsToShow.map((product, index) => {
          const productSlug = product.slug;
          const selectedSize = variantSelections[productSlug]?.size || '';
          const selectedColor = variantSelections[productSlug]?.color || '';
          const selectedPlatform = variantSelections[productSlug]?.platform || '';
          const selectedCopyType = variantSelections[productSlug]?.copyType || '';

          const availableSizes = product.product_variants
            .filter((variant) => !selectedColor || variant.color?.name === selectedColor)
            .map((variant) => variant.size)
            .filter((size, idx, self) => size && self.findIndex((s) => s.name === size.name) === idx);

          const availableColors = product.product_variants
            .filter((variant) => !selectedSize || variant.size?.name === selectedSize)
            .map((variant) => variant.color)
            .filter((color, idx, self) => color && self.findIndex((c) => c.name === color.name) === idx);

          const availablePlatforms = product.product_variants
            .filter((variant) => !selectedCopyType || variant.format === selectedCopyType)
            .map((variant) => variant.platform)
            .filter((platform, idx, self) => platform && self.findIndex((p) => p.name === platform.name) === idx);

          const availableCopyTypes = product.product_variants
            .filter((variant) => !selectedPlatform || variant.platform?.name === selectedPlatform)
            .map((variant) => variant.format)
            .filter((type, idx, self) => type && self.indexOf(type) === idx);

          const selectedVariant = product.product_variants.find(
            (variant) =>
              (!selectedSize || variant.size?.name === selectedSize) &&
              (!selectedColor || variant.color?.name === selectedColor) &&
              (!selectedPlatform || variant.platform?.name === selectedPlatform) &&
              (!selectedCopyType || variant.format === selectedCopyType)
          );

          return (
            <div
              key={product.slug}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              } bg-white shadow-lg rounded p-4 mb-4`}
            >
              <div className="md:w-1/2 flex items-center justify-center h-96"> {/* Increased height */}
                <ImageCarousel images={product.images} mainImage={product.main_image.url} />
              </div>
              <div className="md:w-1/2 flex flex-col justify-center p-4">
                <Link href={`/eshop/${product.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 text-black">{product.title}</h2>
                </Link>
                <p className="text-lg mb-4 text-black">
                  {product.description.replace(/<\/?[^>]+(>|$)/g, '').length > 100 ? (
                    <>
                      {product.description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100)}...
                      <Link href={`/eshop/${product.slug}`} className="text-[#8e67ea] ml-2">
                        Zjistit více
                      </Link>
                    </>
                  ) : (
                    product.description.replace(/<\/?[^>]+(>|$)/g, '')
                  )}
                </p>
                {selectedVariant ? (
                  <>
                    <p className="text-2xl font-semibold mb-2 text-black">{selectedVariant.price} Kč</p>
                    <p className="text-lg text-green-500 font-semibold mb-2">{selectedVariant.stock > 0 ? `Skladem (${selectedVariant.stock} ks)` : 'Není skladem'}</p>
                  </>
                ) : (
                  <p className="text-lg text-red-500 font-semibold mb-2">Není skladem</p>
                )}
                {/* Pokud produkt má varianty */}
                {product.product_variants.length > 0 && (
                  <div>
                    {availableSizes.length > 0 && (
                      <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte velikost</label>
                        <select
                          value={selectedSize}
                          onChange={(e) => handleVariantSelection(product.slug, 'size', e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Vyberte velikost</option>
                          {availableSizes.map((size, idx) => (
                            <option key={idx} value={size?.name}>{size?.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {availableColors.length > 0 && (
                      <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte barvu</label>
                        <select
                          value={selectedColor}
                          onChange={(e) => handleVariantSelection(product.slug, 'color', e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Vyberte barvu</option>
                          {availableColors.map((color, idx) => (
                            <option key={idx} value={color?.name}>{color?.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {availablePlatforms.length > 0 && product.categories.some(category => category.name === 'Hry') && (
                      <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte platformu</label>
                        <select
                          value={selectedPlatform}
                          onChange={(e) => handleVariantSelection(product.slug, 'platform', e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Vyberte platformu</option>
                          {availablePlatforms.map((platform, idx) => (
                            <option key={idx} value={platform?.name}>{platform?.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {availableCopyTypes.length > 0 && product.categories.some(category => category.name === 'Hry') && (
                      <div className="mb-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Vyberte typ kopie</label>
                        <select
                          value={selectedCopyType}
                          onChange={(e) => handleVariantSelection(product.slug, 'copyType', e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                          <option value="">Vyberte typ kopie</option>
                          {availableCopyTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type === 'digital' ? 'Digitální' : 'Fyzická'}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
                <button className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-purple-700">
                  Přidat do košíku
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ImageCarousel = ({ images, mainImage }) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const [index, setIndex] = useState(0);

  const allImages = [mainImage, ...images.map((img) => img.image.url)];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  useEffect(() => {
    setCurrentImage(allImages[index]);
  }, [index, allImages]);

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const handleDotClick = (index) => {
    setIndex(index);
  };

  return (
    <div className="relative w-full h-full"> {/* Full height */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentImage}
          src={`${process.env.NEXT_PUBLIC_INDEX_URL}${currentImage}`}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0 w-full h-full object-cover rounded shadow-lg"
        />
      </AnimatePresence>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {allImages.map((_, i) => (
          <div
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === index ? 'bg-[#8e67ea]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductIndex;
