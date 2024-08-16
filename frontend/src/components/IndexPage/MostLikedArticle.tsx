import React from 'react';
import ContentCard from './ContentCard';

interface MostLikedArticleProps {
  content: any;
}

const MostLikedArticle: React.FC<MostLikedArticleProps> = ({ content }) => <ContentCard content={content} />;

export default MostLikedArticle;
