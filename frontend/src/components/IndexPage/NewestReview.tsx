import React from 'react';
import ContentCard from './ContentCard';

interface NewestReviewProps {
  content: any;
}

const NewestReview: React.FC<NewestReviewProps> = ({ content }) => <ContentCard content={content} />;

export default NewestReview;
