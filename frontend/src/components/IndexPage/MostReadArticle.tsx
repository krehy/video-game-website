import React from 'react';
import ContentCard from './ContentCard';

interface MostReadArticleProps {
  content: any;
}

const MostReadArticle: React.FC<MostReadArticleProps> = ({ content }) => <ContentCard content={content} />;

export default MostReadArticle;
