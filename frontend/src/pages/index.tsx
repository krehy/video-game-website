import { useEffect, useState } from 'react';
import SEOHead from '../components/IndexPage/SEOHead';
import AktualityMarquee from '../components/IndexPage/AktualityMarquee';
import ArticleCard from '../components/BlogPage/ArticleCard';
import ReviewCard from '../components/ReviewsPage/ReviewCard';
import GameCard from '../components/GameDPage/GameCard';
import {
  fetchHomePageSEO,
  fetchAktuality,
  fetchArticles,
  fetchReviews,
  fetchGames,
  fetchTopMostRead,
  fetchMostSearchedGame,
} from '../services/api';
import dayjs from 'dayjs';
import InstagramPhotos from '../components/InstagramPhotos';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Article, Review, Game } from '../types';

const HomePage = () => {
  const [seoData, setSeoData] = useState<any>({});
  const [aktuality, setAktuality] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newestArticle, setNewestArticle] = useState<Article | null>(null);
  const [newestReview, setNewestReview] = useState<Review | null>(null);
  const [mostReadArticle, setMostReadArticle] = useState<Article | null>(null);
  const [mostReadReview, setMostReadReview] = useState<Review | null>(null);
  const [mostLikedArticle, setMostLikedArticle] = useState<Article | null>(null);
  const [mostLikedReview, setMostLikedReview] = useState<Review | null>(null);

  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [todayGames, setTodayGames] = useState<Game[]>([]);
  const [mostSearchedGame, setMostSearchedGame] = useState<Game | null>(null);
  const [topMostReadContent, setTopMostReadContent] = useState<any[]>([]);

  useEffect(() => {
    const getSeoData = async () => {
      try {
        const seo = await fetchHomePageSEO();
        setSeoData(seo[0]); // Assumes the first object in the array is the SEO data for the homepage
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    const getAktuality = async () => {
      try {
        const aktualityData = await fetchAktuality();
        const aktualityTexty = aktualityData.map((aktualita: { text: string }) => aktualita.text);
        setAktuality(aktualityTexty);
      } catch (error) {
        console.error('Error processing aktuality:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getArticlesAndReviews = async () => {
      try {
        const articles = (await fetchArticles()).map(article => ({
          ...article,
          like_count: article.like_count ?? 0,  // Ensure like_count is a number
        }));
        const reviews: Review[] = await fetchReviews();

        if (articles.length > 0) {
          const sortedArticles = articles.sort(
            (a, b) =>
              new Date(b.first_published_at || b.last_published_at).getTime() -
              new Date(a.first_published_at || a.last_published_at).getTime()
          );
          setNewestArticle(sortedArticles[0]);
          setMostReadArticle(
            sortedArticles.reduce(
              (max, article) => (article.read_count > max.read_count ? article : max),
              sortedArticles[0]
            )
          );
          setMostLikedArticle(
            sortedArticles.reduce(
              (max, article) => (article.like_count > max.like_count ? article : max),
              sortedArticles[0]
            )
          );
        }

        if (reviews.length > 0) {
          const sortedReviews = reviews.sort(
            (a, b) =>
              new Date(b.first_published_at || b.last_published_at).getTime() -
              new Date(a.first_published_at || a.last_published_at).getTime()
          );
          setNewestReview(sortedReviews[0]);
          setMostReadReview(
            sortedReviews.reduce(
              (max, review) => (review.read_count > max.read_count ? review : max),
              sortedReviews[0]
            )
          );
          setMostLikedReview(
            sortedReviews.reduce(
              (max, review) => (review.like_count > max.like_count ? review : max),
              sortedReviews[0]
            )
          );
        }
      } catch (error) {
        console.error('Error fetching articles and reviews:', error);
      }
    };

    const getUpcomingGames = async () => {
      try {
        const games: Game[] = await fetchGames();
        const today = dayjs().format('YYYY-MM-DD');
        const currentMonth = dayjs().month();

        const gamesReleasedToday = games.filter(
          (game) => dayjs(game.release_date).format('YYYY-MM-DD') === today
        );
        setTodayGames(gamesReleasedToday);

        const filteredGames = games.filter(
          (game) => dayjs(game.release_date).month() === currentMonth
        );
        setUpcomingGames(filteredGames.slice(0, 4));
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const getMostSearchedGame = async () => {
      try {
        const game = await fetchMostSearchedGame();
        setMostSearchedGame(game);
      } catch (error) {
        console.error('Error fetching most searched game:', error);
      }
    };

    const getTopMostReadContent = async () => {
      try {
        const articles = await fetchTopMostRead('article');
        const reviews = await fetchTopMostRead('review');

        const combinedContent = [...articles, ...reviews]
          .filter((content) => content.active_users > 0)
          .sort((a, b) => b.active_users - a.active_users)
          .slice(0, 3);

        setTopMostReadContent(combinedContent);
      } catch (error) {
        console.error('Error fetching top most-read content:', error);
      }
    };

    getSeoData();
    getAktuality();
    getArticlesAndReviews();
    getUpcomingGames();
    getMostSearchedGame();
    getTopMostReadContent();
  }, []);

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      },
    ],
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container mx-auto p-4">
      <SEOHead seoData={seoData} breadcrumbList={breadcrumbList} />

      <h1 className="text-3xl font-bold">Hlavní stránka</h1>

      {!isLoading && aktuality.length > 0 ? (
        <AktualityMarquee aktuality={aktuality} />
      ) : (
        <p className="text-center text-gray-600 mt-4">Žádné aktuality k zobrazení.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {todayGames.length > 0 ? (
          <div className="md:col-span-2">
            <div className="flex justify-center">
              <motion.h2
                className="text-2xl font-bold text-[#8e67ea] mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                style={{ transformOrigin: 'center' }}
              >
                Dnes vychází!
              </motion.h2>
            </div>

            {todayGames.length === 1 ? (
              <GameCard game={todayGames[0]} info={true} />
            ) : (
              <Slider {...sliderSettings}>
                {todayGames.map((game) => (
                  <div key={game.slug}>
                    <GameCard game={game} info={true} />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        ) : (
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Nejhledanější hra tento týden</h2>
            {mostSearchedGame ? (
              <GameCard game={mostSearchedGame} info={true} />
            ) : (
              <p className="text-gray-600">Žádné hry k zobrazení.</p>
            )}
          </div>
        )}

        <div className="md:col-span-1 flex flex-col">
          <div className="bg-white p-4 h-full rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>
              Nové hry tento měsíc:
            </h2>
            <ul className="space-y-2">
              {upcomingGames.length > 0 ? (
                upcomingGames.map((game) => (
                  <li key={game.id} className="text-gray-800">
                    <Link href={`/games/${game.slug}`}>
                      <span className="hover:underline">
                        {game.title} -{' '}
                        <span className="text-green-600">
                          {dayjs(game.release_date).format('DD.MM.YYYY')}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-600">Žádné hry k zobrazení.</li>
              )}
            </ul>
            <div className="mt-4 text-center">
              <motion.a
                href="/calendar"
                className="text-purple-700 font-semibold"
                style={{ color: '#8e67ea' }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: 2 }}
              >
                Kdy vychází ta moje?
              </motion.a>
            </div>
            {todayGames.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-8" style={{ color: 'black' }}>
                  Nejhledanější hra tento týden:
                </h2>
                {mostSearchedGame ? (
                  <div className="mt-2 text-gray-800">
                    <a
                      style={{ color: '#8e67ea' }}
                      href={`/games/${mostSearchedGame.slug}`}
                      className="hover:underline"
                    >
                      {mostSearchedGame.title}
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-600">Žádné hry k zobrazení.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="md:col-span-2 grid gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Nejnovější</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newestArticle && <ArticleCard info={true} article={newestArticle} />}
              {newestReview && <ReviewCard info={true} review={newestReview} />}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Nejčtenější</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mostReadArticle && <ArticleCard info={true} article={mostReadArticle} />}
              {mostReadReview && <ReviewCard info={true} review={mostReadReview} />}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Nejoblíbenější</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mostLikedArticle && <ArticleCard info={true} article={mostLikedArticle} />}
              {mostLikedReview && <ReviewCard info={true} review={mostLikedReview} />}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <div className="bg-white p-4 h-full rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>
              Aktuálně nejvíc čtěné:
            </h2>
            <ul className="space-y-2">
              {topMostReadContent.length > 0 ? (
                topMostReadContent.map((content) => (
                  <li key={content.id} className="text-gray-800">
                    <a
                      style={{ color: '#8e67ea' }}
                      href={`/${
                        content.content_type === 'article' ? 'blog' : 'reviews'
                      }/${content.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {content.title}
                    </a>
                    <span className="text-sm text-gray-600"> ({content.active_users} čtenářů)</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-600">Je tu ticho 😢</li>
              )}
            </ul>

            <div className="mt-8">
              <InstagramPhotos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
