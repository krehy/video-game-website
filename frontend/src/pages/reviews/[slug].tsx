import React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchReviews, fetchGameById, fetchProductById } from '../../services/api';

const ReviewDetail = ({ review, linkedGame, linkedProduct }) => {
  if (!review) {
    return <div>Review not found</div>;
  }

  const cleanedUrlPath = review.url_path.replace('/placeholder', '');

  const reviewTypeMap = {
    Game: "VideoGame",
    Keyboard: "Product",
    Mouse: "Product",
    Monitor: "Product",
    Computer: "Product",
    Headphones: "Product",
    Console: "Product",
    Mobile: "Product",
    Notebook: "Product",
    Microphone: "Product",
  };

  const reviewItemType = reviewTypeMap[review.review_type] || "Product";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": reviewItemType,
      "name": review.title,
      "image": review.main_image ? `http://localhost:8000${review.main_image.url}` : ''
    },
    "author": {
      "@type": "Person",
      "name": review.owner.username
    },
    "reviewBody": review.body,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating // assuming you have a rating field
    },
    "datePublished": review.first_published_at,
    "dateModified": review.last_published_at
  };

  return (
    <div>
      <Head>
        <title>{review.seo_title || review.title}</title>
        <meta name="description" content={review.search_description} />
        {review.keywords && <meta name="keywords" content={review.keywords} />}
        <meta property="og:title" content={review.seo_title || review.title} />
        <meta property="og:description" content={review.search_description} />
        <meta property="og:url" content={`http://localhost:3000${cleanedUrlPath}`} />
        <meta property="og:type" content="article" />
        {review.main_image && <meta property="og:image" content={`http://localhost:8000${review.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={review.seo_title || review.title} />
        <meta name="twitter:description" content={review.search_description} />
        {review.main_image && <meta name="twitter:image" content={`http://localhost:8000${review.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
      <p className="text-gray-600 mb-4">{review.intro}</p>
      <p className="text-sm text-gray-500 mb-4">Author: {review.owner.username}</p>
      {linkedGame && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Linked Game: {linkedGame.title}</h2>
        </div>
      )}
      {linkedProduct && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Linked Product: {linkedProduct.title}</h2>
        </div>
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: review.body }} />
      {review.categories.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Categories</h3>
          <ul>
            {review.categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const reviews = await fetchReviews();
    const paths = reviews.map((review) => ({
      params: { slug: review.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching reviews for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const reviews = await fetchReviews();
    const review = reviews.find((r) => r.slug === params?.slug);

    if (!review) {
      return {
        notFound: true,
      };
    }

    const linkedGame = review.linked_game ? await fetchGameById(review.linked_game) : null;
    const linkedProduct = review.linked_product ? await fetchProductById(review.linked_product) : null;

    return {
      props: { review, linkedGame, linkedProduct },
    };
  } catch (error) {
    console.error('Error fetching review for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ReviewDetail;
