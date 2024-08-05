import React from 'react';
import Head from 'next/head';
import parse, { domToReact } from 'html-react-parser';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchArticles, fetchGameById, fetchProductById } from '../../services/api';

const ArticleDetail = ({ article, linkedGame, linkedProduct }) => {
  if (!article) {
    return <div>Article not found</div>;
  }

  const cleanedUrlPath = article.url_path.replace('/placeholder', '');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `http://localhost:3000${cleanedUrlPath}`
    },
    "headline": article.seo_title || article.title,
    "image": article.main_image ? `http://localhost:8000${article.main_image.url}` : '',
    "author": {
      "@type": "Person",
      "name": article.owner.username
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Website Name",
      "logo": {
        "@type": "ImageObject",
        "url": "http://localhost:8000/path-to-your-logo.jpg"
      }
    },
    "datePublished": article.first_published_at,
    "dateModified": article.last_published_at,
    "description": article.search_description
  };

  const options = {
    replace: (domNode) => {
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'media') {
        return (
          <div key={domNode.attribs.url} className="video-container">
            <iframe
              width="560"
              height="315"
              src={domNode.attribs.url.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'image') {
        return (
          <img
            key={domNode.attribs.id}
            src={`http://localhost:8000/media/original_images/${domNode.attribs.alt}.jpg`}
            alt={domNode.attribs.alt}
            className={`embedded-image ${domNode.attribs.format}`}
          />
        );
      }
    },
  };

  return (
    <div>
      <Head>
        <title>{article.seo_title || article.title}</title>
        <meta name="description" content={article.search_description} />
        {article.keywords && <meta name="keywords" content={article.keywords} />}
        <meta property="og:title" content={article.seo_title || article.title} />
        <meta property="og:description" content={article.search_description} />
        <meta property="og:url" content={`http://localhost:3000${cleanedUrlPath}`} />
        <meta property="og:type" content="article" />
        {article.main_image && <meta property="og:image" content={`http://localhost:8000${article.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seo_title || article.title} />
        <meta name="twitter:description" content={article.search_description} />
        {article.main_image && <meta name="twitter:image" content={`http://localhost:8000${article.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-4">{article.intro}</p>
      <p className="text-sm text-gray-500 mb-4">Author: {article.owner.username}</p>
      {article.main_image && (
        <div className="mb-4">
          <img src={`http://localhost:8000${article.main_image.url}`} alt={article.title} className="w-full h-auto" />
        </div>
      )}
      {linkedGame && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Linked Game: {linkedGame.title}</h2>
        </div>
      )}
      {linkedProduct && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Linked Product: {linkedProduct.title}</h2>
        </div>
      )}
      <div className="prose">
        {parse(article.body, options)}
      </div>
      {article.categories.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Categories</h3>
          <ul>
            {article.categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const articles = await fetchArticles();
    const paths = articles.map((article) => ({
      params: { slug: article.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching articles for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const articles = await fetchArticles();
    const article = articles.find((a) => a.slug === params?.slug);

    if (!article) {
      return {
        notFound: true,
      };
    }

    const linkedGame = article.linked_game ? await fetchGameById(article.linked_game) : null;
    const linkedProduct = article.linked_product ? await fetchProductById(article.linked_product) : null;

    return {
      props: { article, linkedGame, linkedProduct },
    };
  } catch (error) {
    console.error('Error fetching article for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticleDetail;
