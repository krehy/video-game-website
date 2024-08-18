// src/components/ReviewsPage/ReviewList.tsx
import React from 'react';
import ReviewCard from './ReviewCard';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  visibleReviewsCount: number;
  loadMoreReviews: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, visibleReviewsCount, loadMoreReviews }) => {
  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, visibleReviewsCount).map((review) => (
          <ReviewCard key={review.slug} review={review} />
        ))}
      </div>
      {visibleReviewsCount < reviews.length && (
        <div className="flex justify-center mt-4">
          <button onClick={loadMoreReviews} className="bg-[#8e67ea] text-white py-2 px-4 rounded hover:bg-[#6b4ed8]">
            Načíst další
          </button>
        </div>
      )}
    </>
  );
};

export default ReviewList;
