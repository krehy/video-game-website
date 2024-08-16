import React from 'react';
import ContentCard from './ContentCard';

interface NewestArticleProps {
  content: any;
}

const NewestArticle: React.FC<NewestArticleProps> = ({ content }) => <ContentCard content={content} />;

export default NewestArticle;
