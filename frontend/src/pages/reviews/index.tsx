import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchReviews, fetchReviewIndexSEO } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faEye, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from '@react-spring/web';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../../styles/slider.css';
import { motion } from 'framer-motion';

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

const AnimatedNumber = ({ number, inView }) => {
  const { num } = useSpring({
    from: { num: 0 },
    num: inView ? number : 0,
    config: { mass: 1, tension: 280, friction: 120 },
  });
  return <animated.span>{num.to((n) => (number % 1 === 0 ? n.toFixed(0) : n.toFixed(1)))}</animated.span>;
};

const ReviewIndex = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [seoData, setSeoData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [reviewTypes, setReviewTypes] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    dateRange: [0, 100],
    reviewType: '',
    sortBy: 'newest'
  });
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(9);
  const [dateRange, setDateRange] = useState([0, 100]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    const getReviews = async () => {
      const reviewData = await fetchReviews();
      setReviews(reviewData);
      setFilteredReviews(reviewData);

      if (reviewData.length > 0) {
        const dates = reviewData.map(review => new Date(review.first_published_at).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        setMinDate(minDate);
        setMaxDate(maxDate);
        setFilters({ ...filters, dateRange: [minDate.getTime(), maxDate.getTime()] });
        setDateRange([minDate.getTime(), maxDate.getTime()]);

        // Extract unique review types
        const types = [...new Set(reviewData.map(review => review.review_type))];
        setReviewTypes(types);
      }
    };

    const getSeoData = async () => {
      const seo = await fetchReviewIndexSEO();
      setSeoData(seo);
    };

    getReviews();
    getSeoData();
  }, []);

  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesTitle = filters.title ? review.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesReviewType = filters.reviewType ? review.review_type === filters.reviewType : true;
      const matchesDateRange = filters.dateRange ? isDateInRange(review.first_published_at, filters.dateRange) : true;
      return matchesTitle && matchesDateRange && matchesReviewType;
    });

    filtered = sortReviews(filtered, filters.sortBy);

    setFilteredReviews(filtered);
  }, [filters, reviews]);

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
    const reviewDate = new Date(date).getTime();
    return reviewDate >= range[0] && reviewDate <= range[1];
  };

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  };

  const sortReviews = (reviews, sortBy) => {
    switch (sortBy) {
      case 'newest':
        return reviews.sort((a, b) => new Date(b.first_published_at) - new Date(a.first_published_at));
      case 'oldest':
        return reviews.sort((a, b) => new Date(a.first_published_at) - new Date(b.first_published_at));
      case 'mostRead':
        return reviews.sort((a, b) => b.read_count - a.read_count);
      case 'leastRead':
        return reviews.sort((a, b) => a.read_count - b.read_count);
      case 'aToZ':
        return reviews.sort((a, b) => a.title.localeCompare(b.title));
      case 'zToA':
        return reviews.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return reviews;
    }
  };

  const loadMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 9);
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
        "name": "Recenze",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/reviews`
      }
    ]
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Recenze'}</title>
        <meta name="description" content={seoData.search_description || 'Recenze page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Recenze'} />
        <meta property="og:description" content={seoData.search_description || 'Recenze page description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/reviews`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Recenze'} />
        <meta name="twitter:description" content={seoData.search_description || 'Recenze page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Recenze</h1>
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
        {filteredReviews.slice(0, visibleReviewsCount).map((review) => {
          const averageScore = review.attributes.reduce((acc, attribute) => acc + attribute.score, 0) / review.attributes.length;
          return (
            <div key={review.slug} className="bg-white shadow-md rounded overflow-hidden relative">
              {review.main_image && (
                <div className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`}
                    alt={review.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-[#8e67ea] bg-opacity-70 text-white p-2 flex justify-between items-center">
                    <Link href={`/reviews/${review.slug}`}>
                      <h2 className="text-lg font-semibold">{review.title}</h2>
                    </Link>
                    <Link href={`/reviews/${review.slug}`}>
                      <span className="text-2xl font-bold text-white" title="Získané skóre">
                        <AnimatedNumber number={averageScore} inView={true} />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <FontAwesomeIcon icon={faUser} className="mr-1 text-[#8e67ea]" />
                  <span className="mr-4">{review.owner.username}</span>
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-[#8e67ea]" />
                  <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
                  <FontAwesomeIcon icon={faEye} className="ml-4 text-[#8e67ea]" />
                  <span>{review.read_count}</span>
                </div>
                <p className="text-gray-700 mb-4 break-words">{review.intro}</p>
                <div className="flex flex-wrap">
                  <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {reviewTypeTranslations[review.review_type]}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {visibleReviewsCount < filteredReviews.length && (
        <div className="flex justify-center mt-4">
          <button onClick={loadMoreReviews} className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-[#6b4ed8]">
            Načíst další
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewIndex;
