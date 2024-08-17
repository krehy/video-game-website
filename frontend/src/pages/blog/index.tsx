import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchBlogIndexSEO, fetchCategories } from '../../services/api';
import { motion } from 'framer-motion';
import ArticleCard from '../../components/BlogPage/ArticleCard';
import Filters from '../../components/BlogPage/Filters';
import SEO from '../../components/BlogPage/SEO';
import LoadMoreButton from '../../components/BlogPage/LoadMoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const BlogIndex = ({ initialArticles, initialSeoData, initialCategories }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState(initialArticles);
  const [seoData, setSeoData] = useState(initialSeoData);
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
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
    const dates = articles.map(article => new Date(article.first_published_at).getTime());
    if (dates.length > 0) {
      setMinDate(new Date(Math.min(...dates)));
      setMaxDate(new Date(Math.max(...dates)));
      setFilters({
        ...filters,
        dateRange: [Math.min(...dates), Math.max(...dates)]
      });
      setDateRange([Math.min(...dates), Math.max(...dates)]);
    }
  }, [articles]);

  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesTitle = filters.title ? article.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesCategory = filters.category ? article.category === filters.category : true;
      const matchesDateRange = isDateInRange(article.first_published_at, filters.dateRange);
      return matchesTitle && matchesCategory && matchesDateRange;
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
      <SEO seoData={seoData} breadcrumbList={breadcrumbList} />
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
        <Filters
          categories={categories}
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSliderChange={handleSliderChange}
          dateRange={dateRange}
          formatDate={formatDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </motion.div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.slice(0, visibleArticlesCount).map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <LoadMoreButton onClick={loadMoreArticles} isVisible={visibleArticlesCount < filteredArticles.length} />
    </div>
  );
};

const formatDate = (timestamp) => {
  return timestamp ? new Date(timestamp).toLocaleDateString() : '';
};

export const getServerSideProps = async () => {
  const initialArticles = await fetchArticles();
  const initialSeoData = await fetchBlogIndexSEO();
  const initialCategories = await fetchCategories();

  return {
    props: {
      initialArticles: initialArticles || null,
      initialSeoData: initialSeoData || null,
      initialCategories: initialCategories || null,
    },
  };
};

export default BlogIndex;
