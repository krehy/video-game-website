import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchGames, fetchArticlesByGameId, fetchReviewsByGameId } from '../../services/api';
import CommentShareLike from '../../components/CommentShareLike';
import GameHeader from '../../components/GameDetailPage/GameHeader';
import GameContent from '../../components/GameDetailPage/GameContent';
import GamePinnedContent from '../../components/GameDetailPage/GamePinnedContent';
import GameSchema from '../../components/GameDetailPage/GameSchema';
import BreadcrumbList from '../../components/GameDetailPage/BreadcrumbList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const GameDetail = ({ game }) => {
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

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{game.seo_title || game.title}</title>
        <meta name="description" content={game.search_description} />
        {game.keywords && <meta name="keywords" content={game.keywords} />}
        <meta property="og:title" content={game.seo_title || game.title} />
        <meta property="og:description" content={game.search_description} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${game.url_path}`} />
        <meta property="og:type" content="video.game" />
        {game.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={game.seo_title || game.title} />
        <meta name="twitter:description" content={game.search_description} />
        {game.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`} />}
        <GameSchema game={game} />
        <BreadcrumbList game={game} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      {game.main_image && <GameHeader game={game} />}
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
        <GameContent game={game} isDarkMode={isDarkMode} />
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
        <GamePinnedContent game={game} />
        <CommentShareLike
          pageId={game.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${game.url_path}`}
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
