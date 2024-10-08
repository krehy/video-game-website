// src/components/BlogPage/SEO.tsx

import React from 'react';
import Head from 'next/head';
import { SEOProps } from '../../types';

const SEO: React.FC<SEOProps> = ({ seoData, breadcrumbList }) => {
  const seoTitle = seoData?.seo_title || 'Blog';
  const seoDescription = seoData?.search_description || 'Blog page description';
  const seoKeywords = seoData?.keywords || '';
  const seoImage = seoData?.main_image?.url ? `${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}` : '';

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/blog`} />
      <meta property="og:type" content="website" />
      {seoImage && <meta property="og:image" content={seoImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      {seoImage && <meta name="twitter:image" content={seoImage} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
    </Head>
  );
};

export default SEO;
