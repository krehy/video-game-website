import React, { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { fetchReviews, fetchGameById, incrementReadCount } from '../../services/api';
import ReviewHeader from '../../components/ReviewsDetailPage/ReviewHeader';
import ReviewSchema from '../../components/ReviewsDetailPage/ReviewSchema';
import ReviewBody from '../../components/ReviewsDetailPage/ReviewBody';
import ReviewConclusion from '../../components/ReviewsDetailPage/ReviewConclusion';
import ReviewProsCons from '../../components/ReviewsDetailPage/ReviewProsCons';
import ReviewPinnedContent from '../../components/ReviewsDetailPage/ReviewPinnedContent';
import ReviewMetaTags from '../../components/ReviewsDetailPage/ReviewMetaTags';
import CommentShareLike from '../../components/CommentShareLike';
import ActiveUsers from '../../components/ActiveUsers'; 
import DarkModeToggle from '../../components/ArticleDetailPage/DarkModeToggle';
import { Review, GameLinkedItem } from '../../types';
import TwitchStream from '@/components/TwitchStream';

interface ReviewDetailProps {
  review: Review;
  linkedGame?: GameLinkedItem | null;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review, linkedGame }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [readCount, setReadCount] = useState<number>(review.read_count);

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
    localStorage.setItem('darkMode', newMode.toString());
  };

  if (!review) {
    return <div>Recenze nenalezena</div>;
  }

  const cleanedUrlPath = review.url_path ? review.url_path.replace('/superparmeni', '') : '';
  const averageScore = (review.attributes ?? []).reduce((acc, attribute) => acc + attribute.score, 0) / (review.attributes?.length || 1);

  const reviewPros = review.pros ?? [];
  const reviewCons = review.cons ?? [];

  return (
    <div className="container mx-auto p-4">
      <ReviewMetaTags review={review} cleanedUrlPath={cleanedUrlPath} />
      <ReviewHeader review={review} readCount={readCount} />
      <TwitchStream></TwitchStream>
      <br></br>
      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        
        <ActiveUsers contentType="review" contentId={review.id} />

        <ReviewBody review={review} isDarkMode={isDarkMode} />
        <ReviewConclusion review={review} averageScore={averageScore} isDarkMode={isDarkMode} />
        <ReviewProsCons pros={reviewPros} cons={reviewCons} />
        <ReviewPinnedContent linkedGame={linkedGame ?? undefined} />
        <ReviewSchema review={review} cleanedUrlPath={cleanedUrlPath} averageScore={averageScore} />
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
    const reviews: Review[] = await fetchReviews();

    const paths = reviews.map((review: Review) => ({
      params: { slug: review.slug },
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error fetching reviews for paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context;

  if (!params?.slug || typeof params.slug !== 'string') {
    return { notFound: true };
  }

  try {
    const reviews: Review[] = await fetchReviews();
    const review = reviews.find((r: Review) => r.slug === params.slug);

    if (!review) {
      return {
        notFound: true,
      };
    }

    const linkedGame: GameLinkedItem | null = review.linked_game ? await fetchGameById(review.linked_game).catch(() => null) : null;

    return {
      props: {
        review: {
          ...review,
          like_count: review.like_count || 0,
          dislike_count: review.dislike_count || 0,
        },
        linkedGame,
      },
      revalidate: 10, // Stránka se znovu generuje každých 10 sekund
    };
  } catch (error) {
    console.error('Error fetching review for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ReviewDetail;
