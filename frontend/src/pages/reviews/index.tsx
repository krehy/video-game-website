import React, { useState, useEffect } from 'react';
import { fetchReviews, fetchReviewIndexSEO } from '../../services/api';
import { motion } from 'framer-motion';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ReviewFilters from '../../components/ReviewsPage/ReviewFilter';
import ReviewList from '../../components/ReviewsPage/ReviewList';
import ReviewSEO from '../../components/ReviewsPage/ReviewSEO';

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
      <ReviewSEO seoData={seoData} breadcrumbList={breadcrumbList} />
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
        <ReviewFilters
          filters={filters}
          setFilters={setFilters}
          reviewTypes={reviewTypes}
          minDate={minDate}
          maxDate={maxDate}
          dateRange={dateRange}
          setDateRange={setDateRange}
          formatDate={formatDate}
          handleFilterChange={handleFilterChange}
          handleSliderChange={handleSliderChange}
        />
      </motion.div>
      <ReviewList
        reviews={filteredReviews}
        visibleReviewsCount={visibleReviewsCount}
        loadMoreReviews={loadMoreReviews}
      />
    </div>
  );
};

export default ReviewIndex;
