// pages/blog/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchArticles } from '../../services/api';

const BlogIndex = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      const data = await fetchArticles();
      setArticles(data);
    };
    getArticles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Články</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;
