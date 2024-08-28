import React, { useState, useEffect } from 'react';
import { fetchArticles, fetchBlogIndexSEO, fetchCategories } from '../../services/api';
import { motion } from 'framer-motion';
import ArticleCard from '../../components/BlogPage/ArticleCard';
import Filters from '../../components/BlogPage/Filters';
import SEO from '../../components/BlogPage/SEO';
import LoadMoreButton from '../../components/BlogPage/LoadMoreButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Article, Category, SEOData, ArticleFilters } from '../../types';

interface BlogIndexProps {
  initialArticles: Article[];
  initialSeoData: SEOData;
  initialCategories: Category[];
}

const BlogIndex: React.FC<BlogIndexProps> = ({ initialArticles, initialSeoData, initialCategories }) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles);
  const [seoData, setSeoData] = useState<SEOData>(initialSeoData);
  const [showFilter, setShowFilter] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filters, setFilters] = useState<ArticleFilters>({
    title: '',
    dateRange: [0, 100] as [number, number],
    category: '',
    sortBy: 'newest'
  });
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(9);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 100]);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    const dates = articles.map(article => new Date(article.first_published_at).getTime());
    if (dates.length > 0) {
      const minDateValue = Math.min(...dates);
      const maxDateValue = Math.max(...dates);

      setMinDate(new Date(minDateValue));
      setMaxDate(new Date(maxDateValue));

      setFilters(prevFilters => ({
        ...prevFilters,
        dateRange: [minDateValue, maxDateValue] as [number, number]
      }));

      setDateRange([minDateValue, maxDateValue] as [number, number]);
    }
  }, [articles]);

  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesTitle = filters.title ? article.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesCategory = filters.category ? article.categories.some(cat => cat.name === filters.category) : true;
      const matchesDateRange = isDateInRange(article.first_published_at, filters.dateRange as [number, number]);
      return matchesTitle && matchesCategory && matchesDateRange;
    });

    filtered = sortArticles(filtered, filters.sortBy);
    setFilteredArticles(filtered);
  }, [filters, articles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      setFilters(prevFilters => ({
        ...prevFilters,
        dateRange: [values[0], values[1]] as [number, number]
      }));
      setDateRange([values[0], values[1]] as [number, number]);
    }
  };
  
  

  const isDateInRange = (date: string, range: [number, number]) => {
    const articleDate = new Date(date).getTime();
    return articleDate >= range[0] && articleDate <= range[1];
  };

  const sortArticles = (articles: Article[], sortBy: string) => {
    switch (sortBy) {
      case 'newest':
        return articles.sort((a, b) => new Date(b.first_published_at).getTime() - new Date(a.first_published_at).getTime());
      case 'oldest':
        return articles.sort((a, b) => new Date(a.first_published_at).getTime() - new Date(b.first_published_at).getTime());
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
    setVisibleArticlesCount(prevCount => prevCount + 9);
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
        <h1 style={{color:'white'}} className="text-3xl font-bold">Články</h1>
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

const formatDate = (timestamp: number) => {
  return timestamp ? new Date(timestamp).toLocaleDateString() : '';
};

export const getServerSideProps = async () => {
  const initialArticles = await fetchArticles();
  const initialSeoData = await fetchBlogIndexSEO();
  const initialCategories = await fetchCategories();

  return {
    props: {
      initialArticles: initialArticles || [],
      initialSeoData: initialSeoData || {},
      initialCategories: initialCategories || [],
    },
  };
};

export default BlogIndex;
