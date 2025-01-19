import React, { useState, useEffect } from 'react';
import { fetchGames, fetchGameIndexSEO } from '../../services/api';
import { motion } from 'framer-motion';
import GameFilters from '../../components/GameDPage/GameFilters';
import type { GameFilters as GameFiltersType } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import GameList from '../../components/GameDPage/GameList';
import SEO from '../../components/GameDPage/SEO';
import Breadcrumbs from '../../components/GameDPage/Breadcrumbs';
import { Game, BreadcrumbList } from '../../types';

export async function getServerSideProps() {
  try {
    const seoData = await fetchGameIndexSEO(); // Fetch SEO data
    const games = await fetchGames(); // Fetch games

    return {
      props: {
        seoData: seoData || {},
        games: games || [],
      },
    };
  } catch (error) {
    console.error('Error fetching data for GameIndex:', error);
    return {
      props: {
        seoData: {},
        games: [],
      },
    };
  }
}

const GameIndex: React.FC<{ seoData: any; games: Game[] }> = ({ seoData, games: initialGames }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<GameFiltersType>({
    title: '',
    developer: '',
    publisher: '',
    genres: [],
    platforms: [],
    dateRange: [0, 100],
    sortBy: 'title',
  });
    const [developers, setDevelopers] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 100]);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const getGames = async () => {
      const gameData: Game[] = await fetchGames();
      setGames(gameData);
      setFilteredGames(gameData);
  
      if (gameData.length > 0) {
        const dates = gameData.map((game: Game) => new Date(game.release_date).getTime());
        const minDateValue = new Date(Math.min(...dates));
        const maxDateValue = new Date(Math.max(...dates));
  
        setMinDate(minDateValue);
        setMaxDate(maxDateValue);
  
        const newDateRange: [number, number] = [minDateValue.getTime(), maxDateValue.getTime()];
        setFilters((prevFilters) => ({
          ...prevFilters,
          dateRange: newDateRange,
        }));
  
        setDateRange(newDateRange);
  
        const uniqueDevelopers = Array.from(
          new Set(gameData.map((game) => game.developer?.name).filter((name): name is string => Boolean(name)))
        );
        const uniquePublishers = Array.from(
          new Set(gameData.map((game) => game.publisher?.name).filter((name): name is string => Boolean(name)))
        );
        const uniqueGenres = Array.from(
          new Set(
            gameData.flatMap((game) => game.genres.map((genre) => genre.name)).filter((name): name is string => Boolean(name))
          )
        );
        const uniquePlatforms = Array.from(
          new Set(
            gameData.flatMap((game) => game.platforms?.map((platform) => platform.name) || []).filter((name): name is string => Boolean(name))
          )
        );
  
        setDevelopers(uniqueDevelopers);
        setPublishers(uniquePublishers);
        setGenres(uniqueGenres);
        setPlatforms(uniquePlatforms);
      }
    };
  
    getGames();
  }, []);
  
  useEffect(() => {
    const filtered = games.filter((game) => {
      const matchesTitle = filters.title ? game.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
      const matchesDeveloper = filters.developer ? game.developer?.name === filters.developer : true;
      const matchesPublisher = filters.publisher ? game.publisher?.name === filters.publisher : true;
  
      // Kontrola pro checkboxy žánrů
      const matchesGenres = filters.genres.length > 0
      ? game.genres.some((g) => filters.genres.includes(g.name)) // Obsahuje alespoň jeden vybraný žánr
      : true;
    
    const matchesPlatforms = filters.platforms.length > 0
      ? game.platforms?.some((p) => filters.platforms.includes(p.name)) ?? false // Obsahuje alespoň jednu vybranou platformu
      : true;
          
      const matchesDateRange = filters.dateRange
        ? isDateInRange(game.release_date, filters.dateRange)
        : true;
  
      return matchesTitle && matchesDeveloper && matchesPublisher && matchesGenres && matchesPlatforms && matchesDateRange;
    });
  
    setFilteredGames(filtered);
  }, [filters, games]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      const newDateRange: [number, number] = [value[0], value[1]];
      setFilters((prevFilters) => ({
        ...prevFilters,
        dateRange: newDateRange,
      }));
      setDateRange(newDateRange);
    }
  };

  const isDateInRange = (date: string, range: [number, number]) => {
    const gameDate = new Date(date).getTime();
    return gameDate >= range[0] && gameDate <= range[1];
  };

  const formatDate = (timestamp: number) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : '';
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const breadcrumbList: BreadcrumbList = {
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
        name: 'Databáze Her',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/games`,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <SEO seoData={seoData} breadcrumbList={breadcrumbList} />
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-4">
        <h1 style={{color:'white'}} className="text-3xl font-bold">Databáze Her</h1>
        <button
          onClick={toggleFilter}
          className="relative flex items-center text-[#8e67ea] focus:outline-none group"
        >
          <span className="filter-text text-white transition-transform duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
            Filtrovat
          </span>
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
  setFilters={setFilters} // Přidáno zde
  handleFilterChange={handleFilterChange}
  handleSliderChange={handleSliderChange}
  developers={developers}
  publishers={publishers}
  genres={genres}
  platforms={platforms}
  dateRange={dateRange}
  minDate={minDate || undefined}
  maxDate={maxDate || undefined}
  formatDate={formatDate}
/>
      </motion.div>
      <GameList games={filteredGames} />
    </div>
  );
};

export default GameIndex;
