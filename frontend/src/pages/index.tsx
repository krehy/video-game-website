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

  return (
    <div>
      <Head>
        <title>{seoData.seo_title || 'Hlavní stránka'}</title>
        <meta name="description" content={seoData.search_description || 'Hlavní stránka description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Hlavní stránka'} />
        <meta property="og:description" content={seoData.search_description || 'Hlavní stránka description'} />
        <meta property="og:url" content="http://localhost:3000/" />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Hlavní stránka'} />
        <meta name="twitter:description" content={seoData.search_description || 'Hlavní stránka description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
      </Head>
      <h1>Hlavní stránka</h1>
    </div>
  );
};

export default HomePage;
