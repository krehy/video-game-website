import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import parse from 'html-react-parser';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchGames, fetchArticlesByGameId, fetchReviewsByGameId } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faBuilding, faSun, faMoon, faThumbtack, faTag, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CommentShareLike from '../../components/CommentShareLike';

const GameDetail = ({ game, relatedArticles, relatedReviews }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  if (!game) {
    return <div>Hra nenalezena</div>;
  }

  const cleanedUrlPath = game.url_path.replace('/placeholder', '');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "image": game.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}` : '',
    "description": game.description,
    "author": {
      "@type": "Organization",
      "name": game.developer ? game.developer.name : 'Unknown Developer'
    },
    "publisher": {
      "@type": "Organization",
      "name": game.publisher ? game.publisher.name : 'Unknown Publisher'
    },
    "genre": game.genres.map(genre => genre.name),
    "gamePlatform": game.platforms.map(platform => platform.name)
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Databáze Her",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/games`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": game.title,
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
  const title = game.title;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{game.seo_title || game.title}</title>
        <meta name="description" content={game.search_description} />
        {game.keywords && <meta name="keywords" content={game.keywords} />}
        <meta property="og:title" content={game.seo_title || game.title} />
        <meta property="og:description" content={game.search_description} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="video.game" />
        {game.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={game.seo_title || game.title} />
        <meta name="twitter:description" content={game.search_description} />
        {game.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      {game.main_image && (
        <div className="relative mb-4">
          <img src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`} alt={game.title} className="w-full h-auto object-cover rounded" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
            <div className="flex items-center text-sm mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
              <span className="mr-4">{game.developer ? game.developer.name : 'Unknown Developer'}</span>
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-[#8e67ea] text-lg" />
              <span className="mr-4">{game.publisher ? game.publisher.name : 'Unknown Publisher'}</span>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
              <span>{new Date(game.release_date).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap">
              {game.genres.map((genre) => (
                <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Intro text below image for mobile */}
      <div className="block md:hidden p-4 bg-black bg-opacity-50 text-white rounded mb-4">
        <div className="flex items-center text-sm mb-2">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
          <span className="mr-4">{game.developer ? game.developer.name : 'Unknown Developer'}</span>
          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-[#8e67ea] text-lg" />
          <span className="mr-4">{game.publisher ? game.publisher.name : 'Unknown Publisher'}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
          <span>{new Date(game.release_date).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap">
          {game.genres.map((genre) => (
            <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {genre.name}
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
          {game.description ? parse(game.description, options) : 'No content available'}
        </div>
        {game.trailer_url && (
          <div className="mt-4">
            <iframe
              width="100%"
              height="315"
              src={game.trailer_url.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {/* Připnuto Section */}
        {game.linked_blog_posts.length > 0 || game.linked_reviews.length > 0 ? (
  <div className="mt-6">
    <h2 className="text-2xl font-bold flex items-center">
      <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
      Připnuto:
    </h2>
    <div className="flex flex-wrap mt-4">
      {game.linked_blog_posts.map((article) => (
        <div key={article.id} className="mr-4 mb-4 flex items-center">
          <FontAwesomeIcon icon={faTag} className="mr-2 text-lg" />
          <Link className="mr-2 text-[#8e67ea] text-lg" href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </div>
      ))}
      {game.linked_reviews.map((review) => (
        <div key={review.id} className="mr-4 mb-4 flex items-center">
          <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
          <Link className="mr-2 text-[#8e67ea] text-lg" href={`/reviews/${review.slug}`}>
            {review.title}
          </Link>
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="mt-6">No related articles or reviews found.</p>
)}
        <CommentShareLike
          pageId={game.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
          title={game.title}
          contentType="game"
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const games = await fetchGames();
    const paths = games.map((game) => ({
      params: { slug: game.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching games for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const games = await fetchGames();
    const game = games.find((g) => g.slug === params?.slug);

    if (!game) {
      return {
        notFound: true,
      };
    }

    game.developer = game.developer || { name: 'Unknown Developer' };
    game.publisher = game.publisher || { name: 'Unknown Publisher' };

    const relatedArticles = await fetchArticlesByGameId(game.id);
    const relatedReviews = await fetchReviewsByGameId(game.id);

    return {
      props: { 
        game,
        relatedArticles,
        relatedReviews,
      },
    };
  } catch (error) {
    console.error('Error fetching game for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default GameDetail;
