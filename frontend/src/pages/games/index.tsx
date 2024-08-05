import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchGames, fetchGameIndexSEO } from '../../services/api';

const GameIndex = () => {
  const [games, setGames] = useState([]);
  const [seoData, setSeoData] = useState({});

  useEffect(() => {
    const getGames = async () => {
      const gameData = await fetchGames();
      setGames(gameData);
    };

    const getSeoData = async () => {
      const seo = await fetchGameIndexSEO();
      setSeoData(seo);
    };

    getGames();
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
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Databáze Her",
        "item": `${process.env.NEXT_PUBLIC_SITE_URL}/games`
      }
    ]
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{seoData.seo_title || 'Databáze Her'}</title>
        <meta name="description" content={seoData.search_description || 'Databáze Her page description'} />
        {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
        <meta property="og:title" content={seoData.seo_title || 'Databáze Her'} />
        <meta property="og:description" content={seoData.search_description || 'Databáze Her page description'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/games`} />
        <meta property="og:type" content="website" />
        {seoData.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.seo_title || 'Databáze Her'} />
        <meta name="twitter:description" content={seoData.search_description || 'Databáze Her page description'} />
        {seoData.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${seoData.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4">Databáze Her</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div key={game.slug} className="bg-white shadow-md rounded p-4">
            <Link href={`/games/${game.slug}`}>
              <p style={{ color: 'black' }}>{game.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameIndex;
