import React from 'react';
import { Review } from '../../types'; // Upravte cestu k importu, pokud je to nutné

interface ReviewSchemaProps {
  review: Review;
  cleanedUrlPath: string;
  averageScore: number;
}

const ReviewSchema: React.FC<ReviewSchemaProps> = ({ review, cleanedUrlPath, averageScore }) => {
  const reviewTypeMap: { [key: string]: string } = {
    Game: 'VideoGame',
    Keyboard: 'Product',
    Mouse: 'Product',
    Monitor: 'Product',
    Computer: 'Product',
    Headphones: 'Product',
    Console: 'Product',
    Mobile: 'Product',
    Notebook: 'Product',
    Microphone: 'Product',
  };

  const reviewItemType = reviewTypeMap[review.review_type] || 'Product';

  // Zastropování averageScore na hodnotu 5
  const cappedAverageScore = Math.min(averageScore, 5);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': reviewItemType,
      name: review.title || 'Unnamed Product', // Fallback in case title is missing
      image: review.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}` : '',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: cappedAverageScore,
        bestRating: 5,
        worstRating: 1,
        ratingCount: 1,
      },
    },
    author: {
      '@type': 'Person',
      name: review.owner.username,
    },
    reviewBody: review.intro,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: cappedAverageScore,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: review.first_published_at,
    dateModified: review.last_published_at,
  };

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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Recenze',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/reviews`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: review.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
    </>
  );
};

export default ReviewSchema;
