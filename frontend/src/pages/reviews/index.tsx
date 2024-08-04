// pages/reviews.js
import { useEffect, useState } from 'react';
import { fetchReviews } from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      const data = await fetchReviews();
      setReviews(data);
    };

    getReviews();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recenze</h1>
      {reviews.length ? (
        <ul>
          {reviews.map(review => (
            <li key={review.id}>{review.title}</li>
          ))}
        </ul>
      ) : (
        <p>Načítání recenzí...</p>
      )}
    </div>
  );
};

export default Reviews;
