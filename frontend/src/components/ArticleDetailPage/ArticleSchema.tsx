// components/ArticleSchema.js
import React from 'react';
import Head from 'next/head';

const ArticleSchema = ({ article, cleanedUrlPath }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
    },
    "headline": article.seo_title || article.title,
    "image": article.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}` : '',
    "author": {
      "@type": "Person",
      "name": article.owner.username
    },
    "publisher": {
      "@type": "Organization",
      "name": "Superpařmeni",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_INDEX_URL}/path-to-your-logo.jpg`}
    },
    "datePublished": article.first_published_at,
    "dateModified": article.last_published_at,
    "description": article.search_description
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Domů",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`
      }
    ]
  };

  return (
    <Head>
      <title>{article.seo_title || article.title}</title>
      <meta name="description" content={article.search_description} />
      {article.keywords && <meta name="keywords" content={article.keywords} />}
      <meta property="og:title" content={article.seo_title || article.title} />
      <meta property="og:description" content={article.search_description} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`} />
      <meta property="og:type" content="article" />
      {article.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.seo_title || article.title} />
      <meta name="twitter:description" content={article.search_description} />
      {article.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${article.main_image.url}`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
    </Head>
  );
};

export default ArticleSchema;
