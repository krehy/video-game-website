import React from 'react';
import ContentCard from './ContentCard';

interface MostLikedReviewProps {
  content: any;
}

const MostLikedReview: React.FC<MostLikedReviewProps> = ({ content }) => <ContentCard content={content} />;

export default MostLikedReview;
