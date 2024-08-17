import React from 'react';
import Head from 'next/head';

const SEO = ({ seoData, breadcrumbList }) => {
  const seoTitle = seoData?.seo_title || 'Databáze Her';
  const seoDescription = seoData?.search_description || 'Databáze Her page description';
  const seoKeywords = seoData?.keywords || '';
  const seoImage = seoData?.main_image?.url ? `${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}` : '';

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {seoKeywords && <meta name="keywords" content={seoKeywords} />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/games`} />
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
