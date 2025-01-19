import React, { useState, useEffect } from 'react';
import { fetchReviews, fetchReviewIndexSEO } from '../../services/api';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ReviewFilterComponent from '../../components/ReviewsPage/ReviewFilters';
import ReviewList from '../../components/ReviewsPage/ReviewList';
import ReviewSEO from '../../components/ReviewsPage/ReviewSEO';
import { Review, ReviewFilters as ReviewFiltersType } from '../../types';

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

export async function getServerSideProps() {
  try {
    const seoData = await fetchReviewIndexSEO();
    const reviews = await fetchReviews();

    return {
      props: {
        seoData: seoData || {},
        reviews: reviews || [],
      },
    };
  } catch (error) {
    console.error('Error fetching SEO or reviews data:', error);
    return {
      props: {
        seoData: {},
        reviews: [],
      },
    };
  }
}


const ReviewIndex: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [seoData, setSeoData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [reviewTypes, setReviewTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReviewFiltersType>({
    title: '',
    dateRange: [0, 100] as [number, number],
    reviewType: '',
    sortBy: 'newest',
    category: ''
  });
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(9);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 100]);
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    const getReviews = async () => {
      const reviewData: Review[] = await fetchReviews();
      console.log('API Data:', reviewData); // Debug API data

      const processedReviews = reviewData.map(review => ({
        ...review,
        categories: review.review_type ? [{ id: review.review_type, name: review.review_type }] : []
      }));

      setReviews(processedReviews);
      setFilteredReviews(processedReviews);

      const types = processedReviews
        .map(review => review.review_type)
        .filter((value, index, self) => self.indexOf(value) === index);
      setReviewTypes(types);

      if (processedReviews.length > 0) {
        const dates = processedReviews.map((review: Review) => new Date(review.first_published_at).getTime());
        const minDateValue = new Date(Math.min(...dates));
        const maxDateValue = new Date(Math.max(...dates));
        setMinDate(minDateValue);
        setMaxDate(maxDateValue);
        setFilters(prevFilters => ({
          ...prevFilters,
          dateRange: [minDateValue.getTime(), maxDateValue.getTime()] as [number, number]
        }));
        setDateRange([minDateValue.getTime(), maxDateValue.getTime()] as [number, number]);
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
    let filtered = reviews.filter((review: Review) => {
      const matchesTitle = filters.title
        ? review.title.toLowerCase().includes(filters.title.toLowerCase())
        : true;
  
      // Překlad hodnoty `review_type` pro porovnání
      const translatedReviewType = reviewTypeTranslations[review.review_type] || review.review_type;
  
      const matchesReviewType = filters.reviewType
        ? translatedReviewType === filters.reviewType
        : true;
  
      const matchesDateRange = filters.dateRange.length === 2
        ? isDateInRange(review.first_published_at, filters.dateRange)
        : true;
  
  
      return matchesTitle && matchesDateRange && matchesReviewType;
    });
  
    filtered = sortReviews(filtered, filters.sortBy);
  
    setFilteredReviews(filtered);
  }, [filters, reviews]);
  

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      const [min, max] = values;
      setFilters(prevFilters => ({
        ...prevFilters,
        dateRange: [min, max] as [number, number]
      }));
      setDateRange([min, max] as [number, number]);
    }
  };

  const isDateInRange = (date: string, range: [number, number]) => {
    const reviewDate = new Date(date).getTime();
    return reviewDate >= range[0] && reviewDate <= range[1];
  };

  const formatDate = (timestamp: number) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  };

  const sortReviews = (reviews: Review[], sortBy: string) => {
    switch (sortBy) {
      case 'newest':
        return reviews.sort((a, b) => new Date(b.first_published_at).getTime() - new Date(a.first_published_at).getTime());
      case 'oldest':
        return reviews.sort((a, b) => new Date(a.first_published_at).getTime() - new Date(b.first_published_at).getTime());
      case 'mostRead':
        return reviews.sort((a, b) => (b.read_count ?? 0) - (a.read_count ?? 0));
      case 'leastRead':
        return reviews.sort((a, b) => (a.read_count ?? 0) - (b.read_count ?? 0));
      case 'aToZ':
        return reviews.sort((a, b) => a.title.localeCompare(b.title));
      case 'zToA':
        return reviews.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return reviews;
    }
  };

  const loadMoreReviews = () => {
    setVisibleReviewsCount(prevCount => prevCount + 9);
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": {
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/`,
          "name": "Home"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Recenze",
        "item": {
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/reviews`,
          "name": "Recenze"
        }
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
        <h1 style={{ color: 'white' }} className="text-3xl font-bold">Recenze</h1>
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
        <ReviewFilterComponent
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSliderChange={handleSliderChange}
          dateRange={dateRange}
          categories={reviewTypes.map(type => ({ id: type, name: reviewTypeTranslations[type] || type }))}
          formatDate={formatDate}
          minDate={minDate ?? undefined}
          maxDate={maxDate ?? undefined}
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
