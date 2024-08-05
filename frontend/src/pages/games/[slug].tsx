import React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchGames } from '../../services/api';

const GameDetail = ({ game }) => {
  if (!game) {
    return <div>Game not found</div>;
  }

  const cleanedUrlPath = game.url_path.replace('/placeholder', '');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "image": game.main_image ? `http://localhost:8000${game.main_image.url}` : '',
    "description": game.body,
    "author": {
      "@type": "Organization",
      "name": game.developer.name // using developer name
    },
    "publisher": {
      "@type": "Organization",
      "name": game.publisher.name // using publisher name
    },
    "genre": game.genres.map(genre => genre.name),
    "gamePlatform": game.platforms.map(platform => platform.name)
  };

  return (
    <div>
      <Head>
        <title>{game.seo_title || game.title}</title>
        <meta name="description" content={game.search_description} />
        {game.keywords && <meta name="keywords" content={game.keywords} />}
        <meta property="og:title" content={game.seo_title || game.title} />
        <meta property="og:description" content={game.search_description} />
        <meta property="og:url" content={`http://localhost:3000${cleanedUrlPath}`} />
        <meta property="og:type" content="video.game" />
        {game.main_image && <meta property="og:image" content={`http://localhost:8000${game.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={game.seo_title || game.title} />
        <meta name="twitter:description" content={game.search_description} />
        {game.main_image && <meta name="twitter:image" content={`http://localhost:8000${game.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Developer: {game.developer.name}</p>
      <p className="text-sm text-gray-500 mb-4">Publisher: {game.publisher.name}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: game.body }} />
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

    return {
      props: { game },
    };
  } catch (error) {
    console.error('Error fetching game for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default GameDetail;
