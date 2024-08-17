import React, { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchReviews, fetchGameById, fetchProductById, incrementReadCount } from '../../services/api';
import ReviewHeader from '../../components/ReviewsDetailPage/ReviewHeader';
import ReviewSchema from '../../components/ReviewsDetailPage/ReviewSchema';
import ReviewBody from '../../components/ReviewsDetailPage/ReviewBody';
import ReviewConclusion from '../../components/ReviewsDetailPage/ReviewConclusion';
import ReviewProsCons from '../../components/ReviewsDetailPage/ReviewProsCons';
import ReviewPinnedContent from '../../components/ReviewsDetailPage/ReviewPinnedContent';
import ReviewMetaTags from '../../components/ReviewsDetailPage/ReviewMetaTags';
import CommentShareLike from '../../components/CommentShareLike';
import ActiveUsers from '../../components/ActiveUsers'; 
import DarkModeToggle from '../../components/ArticleDetailPage/DarkModeToggle'; // Import the shared DarkModeToggle

const ReviewDetail = ({ review, linkedGame, linkedProduct }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readCount, setReadCount] = useState(review.read_count);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);

    const incrementReadCountForReview = async () => {
      const count = await incrementReadCount('review', review.id);
      if (count !== null) {
        setReadCount(count);
      }
    };

    incrementReadCountForReview();
  }, [review.id]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  if (!review) {
    return <div>Recenze nenalezena</div>;
  }

  const cleanedUrlPath = review.url_path.replace('/placeholder', '');
  const averageScore = review.attributes.reduce((acc, attribute) => acc + attribute.score, 0) / review.attributes.length;

  return (
    <div className="container mx-auto p-4">
      <ReviewMetaTags review={review} cleanedUrlPath={cleanedUrlPath} />
      <ReviewHeader review={review} readCount={readCount} />

      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        {/* Use the ActiveUsers component */}
        <ActiveUsers contentType="review" contentId={review.id} />

        <ReviewBody review={review} isDarkMode={isDarkMode} />
        <ReviewConclusion review={review} averageScore={averageScore} isDarkMode={isDarkMode} />
        <ReviewProsCons pros={review.pros} cons={review.cons} />
        <ReviewPinnedContent linkedGame={linkedGame} linkedProduct={linkedProduct} />
        <ReviewSchema review={review} cleanedUrlPath={cleanedUrlPath} />
        <CommentShareLike
          pageId={review.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
          title={review.title}
          contentType="review"
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const reviews = await fetchReviews();
    const paths = reviews.map((review) => ({
      params: { slug: review.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching reviews for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const reviews = await fetchReviews();
    const review = reviews.find((r) => r.slug === params?.slug);

    if (!review) {
      return {
        notFound: true,
      };
    }

    const linkedGame = review.linked_game ? await fetchGameById(review.linked_game) : null;
    const linkedProduct = review.linked_product ? await fetchProductById(review.linked_product) : null;

    return {
      props: {
        review: {
          ...review,
          like_count: review.like_count || 0,
          dislike_count: review.dislike_count || 0,
        },
        linkedGame,
        linkedProduct,
      },
    };
  } catch (error) {
    console.error('Error fetching review for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ReviewDetail;
