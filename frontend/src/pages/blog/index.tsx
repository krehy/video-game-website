import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchArticles, fetchBlogIndexSEO } from '../../services/api';

const BlogIndex = () => {
  const [articles, setArticles] = useState([]);
  const [seoData, setSeoData] = useState<any>({});

  useEffect(() => {
    const getArticles = async () => {
      const articleData = await fetchArticles();
      setArticles(articleData);
    };

    const getSeoData = async () => {
      const seo = await fetchBlogIndexSEO();
      setSeoData(seo);
    };

    getArticles();
    getSeoData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Blog'}</title>
        <meta name="description" content={seoData.search_description || 'Blog page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Blog'} />
        <meta property="og:description" content={seoData.search_description || 'Blog page description'} />
        <meta property="og:url" content="http://localhost:3000/blog" />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Blog'} />
        <meta name="twitter:description" content={seoData.search_description || 'Blog page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
      </Head>
      <h1 className="text-3xl font-bold mb-4">Články</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/blog/${article.slug}`}>
              <p style={{ color: 'black' }}>{article.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;
