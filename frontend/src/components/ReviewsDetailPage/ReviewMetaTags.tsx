import React from 'react';
import Head from 'next/head';
import { Review } from '../../types'; // Adjust the import path as necessary

interface ReviewMetaTagsProps {
  review: Review; // Use the Review type for review
  cleanedUrlPath: string;
}

const ReviewMetaTags: React.FC<ReviewMetaTagsProps> = ({ review, cleanedUrlPath }) => {
  return (
    <Head>
      <title>{review.seo_title || review.title}</title>
      <meta name="description" content={review.search_description} />
      {review.keywords && <meta name="keywords" content={review.keywords} />}
      <meta property="og:title" content={review.seo_title || review.title} />
      <meta property="og:description" content={review.search_description} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`} />
      <meta property="og:type" content="article" />
      {review.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={review.seo_title || review.title} />
      <meta name="twitter:description" content={review.search_description} />
      {review.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} />}
    </Head>
  );
};

export default ReviewMetaTags;
