// src/components/ArticleDetailPage/ArticleBody.tsx

import React from 'react';
import parse from 'html-react-parser';
import { ArticleBodyProps } from '../../types';

const ArticleBody: React.FC<ArticleBodyProps> = ({ body, isDarkMode, options }) => (
  <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
    {parse(body, options)}
  </div>
);

export default ArticleBody;
