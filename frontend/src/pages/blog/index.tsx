import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchArticles, fetchBlogIndexSEO, fetchCategories } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faFilter, faEye } from '@fortawesome/free-solid-svg-icons';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../../styles/slider.css';  // Import the custom CSS file for slider
import { motion } from 'framer-motion';

const BlogIndex = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [seoData, setSeoData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    dateRange: [0, 100],
    category: '',
    sortBy: 'newest'
  });
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(9);
  const [dateRange, setDateRange] = useState([0, 100]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    const getArticles = async () => {
      const articleData = await fetchArticles();
      setArticles(articleData);
      setFilteredArticles(articleData);

      if (articleData.length > 0) {
        const dates = articleData.map(article => new Date(article.first_published_at).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        setMinDate(minDate);
        setMaxDate(maxDate);
        setFilters({ ...filters, dateRange: [minDate.getTime(), maxDate.getTime()] });
        setDateRange([minDate.getTime(), maxDate.getTime()]);
      }
    };

    const getSeoData = async () => {
      const seo = await fetchBlogIndexSEO();
      setSeoData(seo);
    };

    const getCategories = async () => {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    };

    getArticles();
    getSeoData();
    getCategories();
  }, []);

  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesTitle = filters.title ? article.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesCategory = filters.category ? article.categories.some(category => category.name === filters.category) : true;
      const matchesDateRange = filters.dateRange ? isDateInRange(article.first_published_at, filters.dateRange) : true;
      return matchesTitle && matchesDateRange && matchesCategory;
    });

    filtered = sortArticles(filtered, filters.sortBy);

    setFilteredArticles(filtered);
  }, [filters, articles]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSliderChange = (value) => {
    setFilters({
      ...filters,
      dateRange: value
    });
    setDateRange(value);
  };

  const isDateInRange = (date, range) => {
    const articleDate = new Date(date).getTime();
    return articleDate >= range[0] && articleDate <= range[1];
  };

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  };

  const sortArticles = (articles, sortBy) => {
    switch (sortBy) {
      case 'newest':
        return articles.sort((a, b) => new Date(b.first_published_at) - new Date(a.first_published_at));
      case 'oldest':
        return articles.sort((a, b) => new Date(a.first_published_at) - new Date(b.first_published_at));
      case 'mostRead':
        return articles.sort((a, b) => b.read_count - a.read_count);
      case 'leastRead':
        return articles.sort((a, b) => a.read_count - b.read_count);
      case 'aToZ':
        return articles.sort((a, b) => a.title.localeCompare(b.title));
      case 'zToA':
        return articles.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return articles;
    }
  };

  const loadMoreArticles = () => {
    setVisibleArticlesCount((prevCount) => prevCount + 9);
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
      }
    ]
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Blog'}</title>
        <meta name="description" content={seoData.search_description || 'Blog page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Blog'} />
        <meta property="og:description" content={seoData.search_description || 'Blog page description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Blog'} />
        <meta name="twitter:description" content={seoData.search_description || 'Blog page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Články</h1>
        <button onClick={toggleFilter} className="relative flex items-center text-[#8e67ea] focus:outline-none group">
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">Filtrovat</span>
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
            <Slider
              range
              min={minDate ? minDate.getTime() : 0}
              max={maxDate ? maxDate.getTime() : 100}
              defaultValue={dateRange}
              value={filters.dateRange}
              onChange={handleSliderChange}
              tipFormatter={(value) => formatDate(value)}
              trackStyle={{ backgroundColor: '#8e67ea' }}
              handleStyle={[{ borderColor: '#8e67ea' }, { borderColor: '#8e67ea' }]}
              railStyle={{ backgroundColor: '#ddd' }}
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
      </motion.div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.slice(0, visibleArticlesCount).map((article) => (
          <div key={article.slug} className="bg-white shadow-md rounded overflow-hidden relative">
            {article.main_image && (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
                  <Link href={`/blog/${article.slug}`}>
                    <h2 className="text-lg font-semibold">{article.title}</h2>
                  </Link>
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
                <span className="mr-4">{article.owner.username}</span>
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
                <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
                <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
                <span>{article.read_count}</span>
              </div>
              <p className="text-gray-700 mb-4">{article.intro}</p>
              <div className="flex flex-wrap">
                {article.categories.map((category) => (
                  <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleArticlesCount < filteredArticles.length && (
        <div className="flex justify-center mt-4">
          <button onClick={loadMoreArticles} className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-[#6b4ed8]">
            Načíst další
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogIndex;
