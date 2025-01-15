import { useEffect, useState } from 'react';
import SEOHead from '../components/IndexPage/SEOHead';
import AktualityMarquee from '../components/IndexPage/AktualityMarquee';
import ArticleHorizontalCard from '../components/BlogPage/ArticleHorizontalCard';
import SmallReviewCard from '../components/ReviewsPage/SmallReviewCard';
import SmallArticleCard from '../components/BlogPage/SmallArticleCard';
import {
  fetchHomePageSEO,
  fetchAktuality,
  fetchArticles,
  fetchReviews,
  fetchGames,
} from '../services/api';
import { Article, Review } from '../types';
import InstagramPhotos from '@/components/InstagramPhotos';
import TwitchStream from '@/components/TwitchStream';
import Link from 'next/link';
import Image from 'next/image';
import gamingFacts from '../constants/gamingFacts';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [seoData, setSeoData] = useState<any>({});
  const [aktuality, setAktuality] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [randomFact, setRandomFact] = useState<string | null>(null);

  useEffect(() => {
    const getSeoData = async () => {
      try {
        const seo = await fetchHomePageSEO();
        setSeoData(seo[0]);
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

    const getArticles = async () => {
      try {
        const articlesData = await fetchArticles();
        const sortedArticles = articlesData.sort(
          (a, b) =>
            new Date(b.first_published_at || b.last_published_at).getTime() -
            new Date(a.first_published_at || a.last_published_at).getTime()
        );
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    const getReviews = async () => {
      try {
        const reviewsData = await fetchReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const getUpcomingGames = async () => {
      try {
        const games = await fetchGames();
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        const upcoming = games.filter((game: any) => {
          const releaseDate = new Date(game.release_date);
          return releaseDate >= now && releaseDate <= oneMonthLater;
        });

        setUpcomingGames(upcoming.slice(0, 3)); // Only keep the first 3 games
      } catch (error) {
        console.error('Error fetching upcoming games:', error);
      }
    };

    // Nastavení náhodného faktu
    const showRandomFact = Math.random() < 0.1; // 10% pravděpodobnost
    if (showRandomFact) {
      const fact = gamingFacts[Math.floor(Math.random() * gamingFacts.length)];
      setRandomFact(fact);
    }

    getSeoData();
    getAktuality();
    getArticles();
    getReviews();
    getUpcomingGames();
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

  const mostLikedArticle = articles.reduce((prev, current) =>
    current.like_count > (prev.like_count || 0) ? current : prev
  , {} as Article);

  return (
    <div className="container mx-auto p-4">
      <SEOHead seoData={seoData} breadcrumbList={breadcrumbList} />

      <h1 className="text-3xl font-bold text-white">
        {randomFact || "Hlavní stránka"}
      </h1>

      {!isLoading && aktuality.length > 0 ? (
        <AktualityMarquee aktuality={aktuality} />
      ) : (
        <p className="text-center text-gray-600 mt-4">Žádné aktuality k zobrazení.</p>
      )}

      {/* Twitch stream pod Aktualitami */}
      <TwitchStream />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          {articles.slice(0, 9).map((article) => (
            <ArticleHorizontalCard key={article.id} article={article} />
          ))}
          {articles.length > 8 && (
            <div className="text-center mt-4">
              <Link href="/blog">
                Zobrazit více
              </Link>
            </div>
          )}
        </div>

        <div className="md:col-span-1 flex flex-col">
          <div className="bg-white p-4 h-full rounded-lg shadow-md">


            <h2 className="text-xl font-semibold mb-4 text-black">
              Nejnovější Recenze:
            </h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <SmallReviewCard key={review.id} review={review} />
              ))}
            </div>
            {mostLikedArticle && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-black">Nejoblíbenější článek:</h2>
                <SmallArticleCard article={mostLikedArticle} />
              </div>
            )}
                        {upcomingGames.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-black">Brzy vyjde:</h2>
                <ul className="space-y-4">
  {upcomingGames.map((game, index) => {
    const imageUrl = game.main_image
      ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`
      : '/default-game-image.jpg';

    const isLeft = index % 2 === 0; // Alternating left/right positions

    return (
      <li
        key={game.id}
        className={`flex items-center ${
          index === 1 ? 'justify-end' : 'space-x-4'
        }`}
      >
        {isLeft && (
          <motion.div
            className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 mr-4"
            whileHover={{ scale: 1.05 }} // Add hover zoom effec
            transition={{ duration: 0.3 }}
          >
            <Link href={`/games/${game.slug}`} legacyBehavior>
              <a>
                <Image
                  src={imageUrl}
                  alt={game.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </a>
            </Link>
          </motion.div>
        )}
        <Link href={`/games/${game.slug}`} legacyBehavior>
          <a
            className={`text-[#8e67ea] text-sm font-semibold hover:underline ${
              index === 1 ? 'ml-auto mr-4' : ''
            }`}
          >
            {game.title}
          </a>
        </Link>
        {!isLeft && (
          <motion.div
            className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 ml-4"
            whileHover={{ scale: 1.05 }} // Add hover zoom effect
            transition={{ duration: 0.3 }}
          >
            <Link href={`/games/${game.slug}`} legacyBehavior>
              <a>
                <Image
                  src={imageUrl}
                  alt={game.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </a>
            </Link>
          </motion.div>
        )}
      </li>
    );
  })}
</ul>
                <div className="mt-4 text-center">
                <div className="mt-4 text-center">
        <a
          href="/calendar"
          rel="noopener noreferrer"
          className="inline-block bg-[#8e67ea] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#764bb5] transition"
        >
          Více nadcházejících her
        </a>
      </div>

                </div>
              </div>
            )}
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
