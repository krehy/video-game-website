import { useEffect, useState } from 'react';
import SEOHead from '../components/IndexPage/SEOHead';
import AktualityMarquee from '../components/IndexPage/AktualityMarquee';
import NewestArticle from '../components/IndexPage/NewestArticle';
import NewestReview from '../components/IndexPage/NewestReview';
import MostReadArticle from '../components/IndexPage/MostReadArticle';
import MostReadReview from '../components/IndexPage/MostReadReview';
import MostLikedArticle from '../components/IndexPage/MostLikedArticle';
import MostLikedReview from '../components/IndexPage/MostLikedReview';
import { fetchHomePageSEO, fetchAktuality, fetchArticles, fetchReviews } from '../services/api';

const HomePage = () => {
  const [seoData, setSeoData] = useState<any>({});
  const [aktuality, setAktuality] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newestArticle, setNewestArticle] = useState<any>(null);
  const [newestReview, setNewestReview] = useState<any>(null);
  const [mostReadArticle, setMostReadArticle] = useState<any>(null);
  const [mostReadReview, setMostReadReview] = useState<any>(null);
  const [mostLikedArticle, setMostLikedArticle] = useState<any>(null);
  const [mostLikedReview, setMostLikedReview] = useState<any>(null);

  useEffect(() => {
    const getSeoData = async () => {
      const seo = await fetchHomePageSEO();
      setSeoData(seo);
    };

    const getAktuality = async () => {
      try {
        const aktualityData = await fetchAktuality();
        const aktualityTexty = aktualityData.map(aktualita => aktualita.text);
        setAktuality(aktualityTexty);
      } catch (error) {
        console.error('Error processing aktuality:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const getArticlesAndReviews = async () => {
      try {
        const articles = await fetchArticles();
        const reviews = await fetchReviews();

        if (articles.length > 0) {
          setNewestArticle(articles[0]);
          setMostReadArticle(articles.reduce((max, article) => (article.read_count > max.read_count ? article : max), articles[0]));
          setMostLikedArticle(articles.reduce((max, article) => (article.like_count > max.like_count ? article : max), articles[0]));
        }

        if (reviews.length > 0) {
          setNewestReview(reviews[0]);
          setMostReadReview(reviews.reduce((max, review) => (review.read_count > max.read_count ? review : max), reviews[0]));
          setMostLikedReview(reviews.reduce((max, review) => (review.like_count > max.like_count ? review : max), reviews[0]));
        }
      } catch (error) {
        console.error('Error fetching articles and reviews:', error);
      }
    };

    getSeoData();
    getAktuality();
    getArticlesAndReviews();
  }, []);

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      }
    ]
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {newestArticle && <NewestArticle content={newestArticle} />}
        {newestReview && <NewestReview content={newestReview} />}
        {mostReadArticle && <MostReadArticle content={mostReadArticle} />}
        {mostReadReview && <MostReadReview content={mostReadReview} />}
        {mostLikedArticle && <MostLikedArticle content={mostLikedArticle} />}
        {mostLikedReview && <MostLikedReview content={mostLikedReview} />}
      </div>
    </div>
  );
};

export default HomePage;
