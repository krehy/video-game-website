// src/pages/blog.tsx
import { useEffect, useState } from 'react';
import { fetchArticles } from '../services/api';

interface Article {
  id: number;
  title: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error('There was an error fetching the articles!', error);
      }
    };

    getArticles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Články</h1>
      {articles.length ? (
        <ul>
          {articles.map(article => (
            <li key={article.id}>{article.title}</li>
          ))}
        </ul>
      ) : (
        <p>Načítání článků...</p>
      )}
    </div>
  );
};

export default Articles;
