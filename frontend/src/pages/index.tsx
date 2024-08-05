import { useEffect, useState } from 'react';
import Head from 'next/head';
import { fetchHomePageSEO } from '../services/api';

const HomePage = () => {
  const [seoData, setSeoData] = useState<any>({});

  useEffect(() => {
    const getSeoData = async () => {
      const seo = await fetchHomePageSEO();
      setSeoData(seo);
    };

    getSeoData();
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
    <div>
      <Head>
        <title>{seoData.seo_title || 'Hlavní stránka'}</title>
        <meta name="description" content={seoData.search_description || 'Hlavní stránka description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Hlavní stránka'} />
        <meta property="og:description" content={seoData.search_description || 'Hlavní stránka description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Hlavní stránka'} />
        <meta name="twitter:description" content={seoData.search_description || 'Hlavní stránka description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1>Hlavní stránka</h1>
    </div>
  );
};

export default HomePage;
