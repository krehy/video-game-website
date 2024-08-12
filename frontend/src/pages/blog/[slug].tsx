import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import parse from 'html-react-parser';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchArticles, fetchGameById, fetchProductById, incrementReadCount } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faSun, faMoon, faTag, faThumbtack, faGamepad, faEye } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CommentShareLike from '../../components/CommentShareLike';

const ArticleDetail = ({ article, linkedGame, linkedProduct }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readCount, setReadCount] = useState(article.read_count);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);

    const incrementReadCountForArticle = async () => {
      try {
        const count = await incrementReadCount('article', article.id);
        if (count !== null) {
          setReadCount(count);
        }
      } catch (error) {
        console.error("Error incrementing read count:", error);
      }
    };

    incrementReadCountForArticle();
  }, [article.id]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  if (!article) {
    return <div>Článek nenalezen</div>;
  }

  const cleanedUrlPath = article.url_path.replace('/placeholder', '');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
    },
    "headline": article.seo_title || article.title,
    "image": article.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}` : '',
    "author": {
      "@type": "Person",
      "name": article.owner.username
    },
    "publisher": {
      "@type": "Organization",
      "name": "Superpařmeni",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_INDEX_URL}/path-to-your-logo.jpg`}
    },
    "datePublished": article.first_published_at,
    "dateModified": article.last_published_at,
    "description": article.search_description
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
      }
    ]
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
            src={`${process.env.NEXT_PUBLIC_INDEX_URL}/media/original_images/${domNode.attribs.alt}.jpg`}
            alt={domNode.attribs.alt}
            className={`embedded-image ${domNode.attribs.format}`}
          />
        );
      }
    },
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`;
  const title = article.title;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{article.seo_title || article.title}</title>
        <meta name="description" content={article.search_description} />
        {article.keywords && <meta name="keywords" content={article.keywords} />}
        <meta property="og:title" content={article.seo_title || article.title} />
        <meta property="og:description" content={article.search_description} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        {article.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seo_title || article.title} />
        <meta name="twitter:description" content={article.search_description} />
        {article.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      {article.main_image && (
        <div className="relative mb-4">
          <img src={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`} alt={article.title} className="w-full h-auto object-cover rounded" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
            <p className="mb-2">{article.intro}</p>
            <div className="flex items-center text-sm mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
              <span className="mr-4">{article.owner.username}</span>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
              <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
              <FontAwesomeIcon icon={faEye} className="mr-2 text-[#8e67ea] text-lg" />
              <span>{readCount}</span>
            </div>
            <div className="flex flex-wrap">
              {article.categories.map((category) => (
                <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Intro text below image for mobile */}
      <div className="block md:hidden p-4 bg-black bg-opacity-50 text-white rounded mb-4">
        <p className="mb-2">{article.intro}</p>
        <div className="flex items-center text-sm mb-2">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
          <span className="mr-4">{article.owner.username}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
          <span>{new Date(article.first_published_at).toLocaleDateString()}</span>
          <FontAwesomeIcon icon={faEye} className="mr-2 text-[#8e67ea] text-lg" />
          <span>{readCount}</span>
        </div>
        <div className="flex flex-wrap">
          {article.categories.map((category) => (
            <span key={category.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {category.name}
            </span>
          ))}
        </div>
      </div>
      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <div className="absolute top-4 right-4 flex items-center">
          <FontAwesomeIcon icon={faSun} className={`mr-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              style={{ top: '-4px', left: isDarkMode ? '24px' : '4px' }}
            />
            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
          <FontAwesomeIcon icon={faMoon} className={`ml-2 text-lg ${isDarkMode ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
          {parse(article.body, options)}
        </div>
        {(linkedGame || linkedProduct) && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
              Připnuto:
            </h2>
            <div className="flex flex-wrap mt-4">
              {linkedGame ? (
                <div className="mr-4 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
                  <Link className="mr-2 text-[#8e67ea] text-lg" href={`/games/${linkedGame.slug}`}>
                    {linkedGame.title}
                  </Link>
                </div>
              ) : (
                <div className="mr-4 mb-4 text-lg text-red-500">
                  Hra nebyla nalezena.
                </div>
              )}
              {linkedProduct ? (
                <div className="mr-4 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-lg" />
                  <Link className="mr-2 text-[#8e67ea] text-lg" href={`/eshop/${linkedProduct.slug}`}>
                    {linkedProduct.title}
                  </Link>
                </div>
              ) : (
                <div className="mr-4 mb-4 text-lg text-red-500">
                  Produkt nebyl nalezen.
                </div>
              )}
            </div>
          </div>
        )}
        <CommentShareLike
          pageId={article.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
          title={article.title}
          contentType="article"
        />
      </div>
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

    const linkedGame = article.linked_game ? await fetchGameById(article.linked_game).catch(() => null) : null;
    const linkedProduct = article.linked_product ? await fetchProductById(article.linked_product).catch(() => null) : null;

    return {
      props: { 
        article: {
          ...article,
          like_count: article.like_count || 0,
          dislike_count: article.dislike_count || 0,
        },
        linkedGame, 
        linkedProduct 
      },
    };
  } catch (error) {
    console.error('Error fetching article for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticleDetail;
