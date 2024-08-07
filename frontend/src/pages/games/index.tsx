import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchGames, fetchGameIndexSEO } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import 'rc-slider/assets/index.css';
import '../../styles/slider.css';
import '../../styles/animation.css';

const GameIndex = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [seoData, setSeoData] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    developer: '',
    publisher: '',
    genre: '',
    platform: '',
  });
  const [developers, setDevelopers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      const gameData = await fetchGames();
      setGames(gameData);
      setFilteredGames(gameData);

      // Extract unique developers, publishers, genres, and platforms
      const uniqueDevelopers = [...new Set(gameData.map(game => game.developer?.name).filter(Boolean))];
      const uniquePublishers = [...new Set(gameData.map(game => game.publisher?.name).filter(Boolean))];
      const uniqueGenres = [...new Set(gameData.flatMap(game => game.genres.map(genre => genre.name)).filter(Boolean))];
      const uniquePlatforms = [...new Set(gameData.flatMap(game => game.platforms.map(platform => platform.name)).filter(Boolean))];

      setDevelopers(uniqueDevelopers);
      setPublishers(uniquePublishers);
      setGenres(uniqueGenres);
      setPlatforms(uniquePlatforms);
    };

    const getSeoData = async () => {
      const seo = await fetchGameIndexSEO();
      setSeoData(seo);
    };

    getGames();
    getSeoData();
  }, []);

  useEffect(() => {
    let filtered = games.filter(game => {
      const matchesTitle = filters.title ? game.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesDeveloper = filters.developer ? game.developer?.name === filters.developer : true;
      const matchesPublisher = filters.publisher ? game.publisher?.name === filters.publisher : true;
      const matchesGenre = filters.genre ? game.genres.some(genre => genre.name === filters.genre) : true;
      const matchesPlatform = filters.platform ? game.platforms.some(platform => platform.name === filters.platform) : true;
      return matchesTitle && matchesDeveloper && matchesPublisher && matchesGenre && matchesPlatform;
    });

    setFilteredGames(filtered);
  }, [filters, games]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Databáze Her</h1>
        <button onClick={toggleFilter} className="relative flex items-center text-[#8e67ea] focus:outline-none group">
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">Filtrovat</span>
          <FontAwesomeIcon icon={faFilter} className="text-2xl ml-2" />
        </button>
      </div>
      {showFilter && (
        <div className="bg-white p-4 shadow-md rounded mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Hledat
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={filters.title}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Zadejte název hry"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="developer">
              Vývojář
            </label>
            <select
              name="developer"
              id="developer"
              value={filters.developer}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Všichni vývojáři</option>
              {developers.map((developer, index) => (
                <option key={index} value={developer}>{developer}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publisher">
              Vydavatel
            </label>
            <select
              name="publisher"
              id="publisher"
              value={filters.publisher}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Všichni vydavatelé</option>
              {publishers.map((publisher, index) => (
                <option key={index} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
              Žánr
            </label>
            <select
              name="genre"
              id="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Všechny žánry</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="platform">
              Platforma
            </label>
            <select
              name="platform"
              id="platform"
              value={filters.platform}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Všechny platformy</option>
              {platforms.map((platform, index) => (
                <option key={index} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => (
          <div key={game.slug} className="bg-white shadow-md rounded overflow-hidden relative">
            {game.main_image && (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
                  <Link href={`/games/${game.slug}`}>
                    <h2 className="text-lg font-semibold">{game.title}</h2>
                  </Link>
                </div>
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-700 mb-4 break-words">{game.description}</p>
              <div className="flex flex-wrap">
                {game.developer && (
                  <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {game.developer.name}
                  </span>
                )}
                {game.publisher && (
                  <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {game.publisher.name}
                  </span>
                )}
                {game.genres.map((genre) => (
                  <span key={genre.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {genre.name}
                  </span>
                ))}
                {game.platforms.map((platform) => (
                  <span key={platform.id} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameIndex;
