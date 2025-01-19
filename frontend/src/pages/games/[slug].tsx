import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchGames, fetchArticlesByGameId, fetchReviewsByGameId, incrementSearchWeek } from '../../services/api';
import CommentShareLike from '../../components/CommentShareLike';
import GameHeader from '../../components/GameDetailPage/GameHeader';
import GameContent from '../../components/GameDetailPage/GameContent';
import GamePinnedContent from '../../components/GameDetailPage/GamePinnedContent';
import GameSchema from '../../components/GameDetailPage/GameSchema';
import BreadcrumbList from '../../components/GameDetailPage/BreadcrumbList';
import { Game } from '../../types'; 
import TwitchStream from '@/components/TwitchStream';

interface GameDetailProps {
  game: Game;
}

const GameDetail: React.FC<GameDetailProps> = ({ game }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    const lastViewed = localStorage.getItem(`lastViewed_${game.id}`);
    const today = new Date().toISOString().split('T')[0];

    if (lastViewed !== today) {
      incrementSearchWeek(Number(game.id))
        .then(data => {
          if (data) {
            console.log('Week search count:', data.search_week);
            localStorage.setItem(`lastViewed_${game.id}`, today);
          }
        })
        .catch(error => console.error('Error incrementing week search:', error));
    }
  }, [game.id]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
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
        <GameSchema game={game} />
        <BreadcrumbList game={{ ...game, url_path: game.url_path ?? '' }} />
      </Head>
      <h1 style={{color:'white'}} className="text-3xl font-bold mb-4">{game.title}</h1>
      {game.main_image && <GameHeader game={game} />}
      <TwitchStream></TwitchStream>
      <br></br>
      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <div className="absolute top-4 right-4 flex items-center">
          {/* Dark mode toggle */}
        </div>
        
        <GameContent game={game} isDarkMode={isDarkMode} />
        {game.trailer_url && (
          <div className="mt-4">
            <iframe
              width="560"
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
    const games: Game[] = await fetchGames(); 
    const paths = games.map((game: Game) => ({
      params: { slug: game.slug },
    }));
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error fetching games for paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const games: Game[] = await fetchGames();
    const game = games.find((g: Game) => g.slug === params?.slug);

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
      revalidate: 10, // Stránka se znovu generuje každých 10 sekund
    };
  } catch (error) {
    console.error('Error fetching game for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default GameDetail;
