import React, { useState, useEffect } from 'react';
import { fetchGames, fetchGameIndexSEO } from '../../services/api';
import { motion } from 'framer-motion';
import GameFilters from '../../components/GameDPage/GameFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter} from '@fortawesome/free-solid-svg-icons';
import GameList from '../../components/GameDPage/GameList';
import SEO from '../../components/GameDPage/SEO';
import Breadcrumbs from '../../components/GameDPage/Breadcrumbs';

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
    dateRange: [0, 100],
  });
  const [developers, setDevelopers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [dateRange, setDateRange] = useState([0, 100]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    const getGames = async () => {
      const gameData = await fetchGames();
      setGames(gameData);
      setFilteredGames(gameData);

      if (gameData.length > 0) {
        const dates = gameData.map(game => new Date(game.release_date).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        setMinDate(minDate);
        setMaxDate(maxDate);
        setFilters({ ...filters, dateRange: [minDate.getTime(), maxDate.getTime()] });
        setDateRange([minDate.getTime(), maxDate.getTime()]);

        const uniqueDevelopers = [...new Set(gameData.map(game => game.developer?.name).filter(Boolean))];
        const uniquePublishers = [...new Set(gameData.map(game => game.publisher?.name).filter(Boolean))];
        const uniqueGenres = [...new Set(gameData.flatMap(game => game.genres.map(genre => genre.name)).filter(Boolean))];
        const uniquePlatforms = [...new Set(gameData.flatMap(game => game.platforms.map(platform => platform.name)).filter(Boolean))];

        setDevelopers(uniqueDevelopers);
        setPublishers(uniquePublishers);
        setGenres(uniqueGenres);
        setPlatforms(uniquePlatforms);
      }
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
      const matchesDateRange = filters.dateRange ? isDateInRange(game.release_date, filters.dateRange) : true;
      return matchesTitle && matchesDeveloper && matchesPublisher && matchesGenre && matchesPlatform && matchesDateRange;
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

  const handleSliderChange = (value) => {
    setFilters({
      ...filters,
      dateRange: value
    });
    setDateRange(value);
  };

  const isDateInRange = (date, range) => {
    const gameDate = new Date(date).getTime();
    return gameDate >= range[0] && gameDate <= range[1];
  };

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="container mx-auto p-4">
      <SEO seoData={seoData} />
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Databáze Her</h1>
        <button onClick={toggleFilter} className="relative flex items-center text-[#8e67ea] focus:outline-none group">
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">Filtrovat</span>
          <FontAwesomeIcon icon={faFilter} className="text-2xl ml-2" />
        </button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilter ? 'auto' : 0, opacity: showFilter ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <GameFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSliderChange={handleSliderChange}
          developers={developers}
          publishers={publishers}
          genres={genres}
          platforms={platforms}
          dateRange={dateRange}
          minDate={minDate}
          maxDate={maxDate}
          formatDate={formatDate}
        />
      </motion.div>
      <GameList games={filteredGames} />
    </div>
  );
};

export default GameIndex;
