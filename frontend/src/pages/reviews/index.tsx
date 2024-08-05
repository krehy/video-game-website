import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchReviews, fetchReviewIndexSEO } from '../../services/api';

const ReviewIndex = () => {
  const [reviews, setReviews] = useState([]);
  const [seoData, setSeoData] = useState({});

  useEffect(() => {
    const getReviews = async () => {
      const reviewData = await fetchReviews();
      setReviews(reviewData);
    };

    const getSeoData = async () => {
      const seo = await fetchReviewIndexSEO();
      setSeoData(seo);
    };

    getReviews();
    getSeoData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Recenze'}</title>
        <meta name="description" content={seoData.search_description || 'Recenze page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Recenze'} />
        <meta property="og:description" content={seoData.search_description || 'Recenze page description'} />
        <meta property="og:url" content="http://localhost:3000/reviews" />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Recenze'} />
        <meta name="twitter:description" content={seoData.search_description || 'Recenze page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
      </Head>
      <h1 className="text-3xl font-bold mb-4">Recenze</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/reviews/${review.slug}`}>
              <p style={{ color: 'black' }}>{review.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewIndex;
