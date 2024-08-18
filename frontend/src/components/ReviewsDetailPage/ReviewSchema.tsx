import React from 'react';
import { Review } from '../../types'; // Adjust the import path if necessary

// Define the props interface
interface ReviewSchemaProps {
  review: Review;
  cleanedUrlPath: string;
}

const ReviewSchema: React.FC<ReviewSchemaProps> = ({ review, cleanedUrlPath }) => {
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

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': reviewItemType,
      name: review.title,
      image: review.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}` : '',
    },
    author: {
      '@type': 'Person',
      name: review.owner.username,
    },
    reviewBody: review.intro, // Change `review.body` to an existing property like `intro`
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating, // Ensure `rating` exists in the Review interface
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
