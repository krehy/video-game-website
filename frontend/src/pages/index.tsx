import { useEffect, useState } from 'react';
import SEOHead from '../components/IndexPage/SEOHead';
import AktualityMarquee from '../components/IndexPage/AktualityMarquee';
import ArticleHorizontalCard from '../components/BlogPage/ArticleHorizontalCard';
import SmallReviewCard from '../components/ReviewsPage/SmallReviewCard';
import SmallArticleCard from '../components/BlogPage/SmallArticleCard';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {
  fetchHomePageSEO,
  fetchAktuality,
  fetchLatestArticles,
  fetchMostLikedArticle,
  fetchReviews,
  fetchGamesHomepage,
} from '../services/api';
import { Article, Review } from '../types';
import InstagramPhotos from '@/components/InstagramPhotos';
import TwitchStream from '@/components/TwitchStream';
import Link from 'next/link';
import Image from 'next/image';
import gamingFacts from '../constants/gamingFacts';
import { motion } from 'framer-motion';

export async function getServerSideProps() {
  try {
    const seo = await fetchHomePageSEO();
    return {
      props: {
        seoData: seo[0] || {},
      },
    };
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return {
      props: {
        seoData: {},
      },
    };
  }
}

const HomePage = () => {
  const [seoData, setSeoData] = useState<any>({});
  const [aktuality, setAktuality] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mostLikedArticle, setMostLikedArticle] = useState<Article | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [randomFact, setRandomFact] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataWithCache = async () => {
      const now = Date.now();
      const cacheExpiration = 60 * 1000; // 1 minuta
  
      // Načítání z localStorage
      const cachedData = {
        seo: JSON.parse(localStorage.getItem('seoData') || 'null'),
        aktuality: JSON.parse(localStorage.getItem('aktuality') || 'null'),
        articles: JSON.parse(localStorage.getItem('articles') || 'null'),
        mostLikedArticle: JSON.parse(localStorage.getItem('mostLikedArticle') || 'null'),
        reviews: JSON.parse(localStorage.getItem('reviews') || 'null'),
        upcomingGames: JSON.parse(localStorage.getItem('upcomingGames') || 'null'),
        lastFetch: parseInt(localStorage.getItem('lastFetch') || '0', 10),
      };
  
      const shouldFetch = !cachedData.lastFetch || now - cachedData.lastFetch > cacheExpiration;
  
      if (!shouldFetch && cachedData.articles && cachedData.upcomingGames) {
        setSeoData(cachedData.seo || {});
        setAktuality(cachedData.aktuality || []);
        setArticles(cachedData.articles || []);
        setMostLikedArticle(cachedData.mostLikedArticle || null);
        setReviews(cachedData.reviews || []);
        setUpcomingGames(cachedData.upcomingGames || []);
        setIsLoading(false);
        return;
      }
  
      try {
        const [
          seo,
          aktualityData,
          latestArticles,
          likedArticle,
          reviewsData,
          upcomingGamesData
        ] = await Promise.all([
          fetchHomePageSEO(),
          fetchAktuality(),
          fetchLatestArticles(),  // Nový endpoint
          fetchMostLikedArticle(),
          fetchReviews(),
          fetchGamesHomepage(),  // Nový endpoint
        ]);
  
        // Nastavení dat
        setSeoData(seo[0]);
        localStorage.setItem('seoData', JSON.stringify(seo[0]));
  
        const aktualityTexty = aktualityData.map((aktualita: { text: string }) => aktualita.text);
        setAktuality(aktualityTexty);
        localStorage.setItem('aktuality', JSON.stringify(aktualityTexty));
  
        setArticles(latestArticles);
        localStorage.setItem('articles', JSON.stringify(latestArticles));
  
        setMostLikedArticle(likedArticle);
        localStorage.setItem('mostLikedArticle', JSON.stringify(likedArticle));
  
        setReviews(reviewsData);
        localStorage.setItem('reviews', JSON.stringify(reviewsData));
  
        setUpcomingGames(upcomingGamesData);
        localStorage.setItem('upcomingGames', JSON.stringify(upcomingGamesData));
  
        localStorage.setItem('lastFetch', now.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDataWithCache();
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

  return (
    <div className="container mx-auto p-4">
      <SEOHead seoData={seoData} breadcrumbList={breadcrumbList} />
  
      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white">
            {randomFact || 'Hlavní stránka'}
          </h1>
  
          {aktuality.length > 0 ? (
            <AktualityMarquee aktuality={aktuality} />
          ) : (
            <p className="text-center text-gray-600 mt-4">Žádné aktuality k zobrazení.</p>
          )}
  
          {/* Twitch stream pod Aktualitami */}
          <TwitchStream />
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              {articles.slice(0, 9).map((article, index) => (
    <ArticleHorizontalCard key={article.id} article={article} isFirst={index === 0} />
  ))}
              {articles.length > 4 && (
                <div className="text-center mt-4">
                  <Link href="/blog">Zobrazit více</Link>
                </div>
              )}
            </div>
  
            <div className="md:col-span-1 flex flex-col">
              <div className="bg-white p-4 h-full rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-black">Nejnovější Recenze:</h2>
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
                {/* Nadcházející hry */}
                {upcomingGames.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-black">Brzy vyjde:</h2>
                    <ul className="space-y-4">
                      {upcomingGames.map((game) => {
                        const imageUrl = game.main_image
                          ? `${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image}`
                          : '/default-game-image.jpg';
  
                        const formattedDate = new Date(game.release_date).toLocaleDateString('cs-CZ', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        });
  
                        return (
                          <li
                            key={game.id}
                            className="flex items-center space-x-4 bg-gray-200 p-4 rounded-lg"
                          >
                            <motion.div
                              className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 mr-4"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Link href={`/games/${game.slug}`} legacyBehavior>
                                <Image
                                  src={imageUrl}
                                  alt={game.title}
                                  fill
                                  className="rounded-lg cursor-pointer object-cover"
                                />
                              </Link>
                            </motion.div>
                            <div className="flex flex-col">
                              <Link href={`/games/${game.slug}`} legacyBehavior>
                                <a className="text-[#8e67ea] text-sm font-semibold hover:underline">
                                  {game.title}
                                </a>
                              </Link>
                              <span className="text-sm text-gray-600">({formattedDate})</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 text-center">
                      <Link
                        href="/calendar"
                        className="inline-block bg-[#8e67ea] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#764bb5] transition"
                      >
                        Více nadcházejících her
                      </Link>
                    </div>
                  </div>
                )}
                <div className="mt-8">
                  <InstagramPhotos />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
};

export default HomePage;