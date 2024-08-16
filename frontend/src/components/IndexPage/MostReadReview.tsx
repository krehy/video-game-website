import React from 'react';
import ContentCard from './ContentCard';

interface MostReadReviewProps {
  content: any;
}

const MostReadReview: React.FC<MostReadReviewProps> = ({ content }) => <ContentCard content={content} />;

export default MostReadReview;
