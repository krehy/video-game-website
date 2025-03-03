import { useEffect, useState } from 'react';
import SEOHead from '../../components/IndexPage/SEOHead';
import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import { fetchLiveEsportsMatches, fetchRecentEsportsResults } from '../../services/esport';
import { fetchEsportPosts } from '../../services/api'; // Import the fetchEsportPosts function
import { EsportsMatch, EsportsResult, Article } from '../../types';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import '../../styles/slider.css'; // Import custom CSS for slider
import ArticleCard from '../../components/BlogPage/ArticleCard'; // Import the ArticleCard component


const EsportsPage = () => {
  const [seoData, setSeoData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState<EsportsMatch[]>([]);
  const [recentResults, setRecentResults] = useState<EsportsResult[]>([]);
  const [esportPosts, setEsportPosts] = useState<Article[]>([]); // State for eSport posts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveMatchesData, recentResultsData, esportPostsData] = await Promise.all([
          fetchLiveEsportsMatches(),
          fetchRecentEsportsResults(),
          fetchEsportPosts(), // Fetch eSport posts
        ]);

        setLiveMatches(liveMatchesData);
        setRecentResults(recentResultsData);
        setEsportPosts(esportPostsData); // Set eSport posts data

        // Debug výpis do konzole
      } catch (error) {
        console.error('Chyba při získávání dat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupByGame = (items: any[], key: string) => {
    return items.reduce((result, item) => {
      const gameName = item[key]?.name || 'Neznámá hra';
      (result[gameName] = result[gameName] || []).push(item);
      return result;
    }, {});
  };

  const sortGames = (games: string[]) => {
    const preferredOrder = ['Valorant', 'CS:GO', 'League of Legends', 'Overwatch', 'Mobile Legends'];
    return games.sort((a, b) => {
      const indexA = preferredOrder.indexOf(a);
      const indexB = preferredOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const liveMatchesByGame = groupByGame(liveMatches, 'videogame');
  const recentResultsByGame = groupByGame(recentResults, 'videogame');

  const sortedGames = sortGames(Object.keys(recentResultsByGame));

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domů',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Esports',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/esports`,
      },
    ],
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 sekund
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <SEOHead seoData={seoData} breadcrumbList={breadcrumbList} />

      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <h1 className="text-3xl font-bold">Esport</h1>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Aktuálně zápasí</h2>
            {liveMatches.length > 0 ? (
                <Slider {...sliderSettings}>
                {liveMatches.map((match) => (
                  <div key={match.id} className="bg-white p-8 rounded-lg shadow-md h-auto flex flex-col justify-center">
                  <h3 style={{color:"Black"}} className="text-center text-xl font-semibold mb-4">
                  {match.videogame?.name || 'Neznámá hra'}
                  </h3>
                  <p className="text-center text-gray-600">{new Date(match.scheduled_at).toLocaleString()}</p>
                  <p className="text-center text-gray-600">{match.league.name} - {match.tournament.name}</p>
                  <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                  {match.opponents[0].opponent.image_url && (
                    <Image
                    src={match.opponents[0].opponent.image_url}
                    alt={match.opponents[0].opponent.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                    />
                  )}
                  <span className="text-black text-2xl font-semibold mt-2">{match.opponents[0].opponent.name}</span>
                  </div>
                  <div className="flex flex-col items-center mx-4 flex-grow text-center">
                  <span className="text-black text-2xl font-semibold">VS</span>
                  {match.results && (
                    <span className="text-black text-2xl font-semibold mt-2">
                    {match.results[0]?.score} - {match.results[1]?.score}
                    </span>
                  )}
                  </div>
                  <div className="flex flex-col items-center">
                  {match.opponents[1].opponent.image_url && (
                    <Image
                    src={match.opponents[1].opponent.image_url}
                    alt={match.opponents[1].opponent.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                    />
                  )}
                  <span className="text-black text-2xl font-semibold mt-2">{match.opponents[1].opponent.name}</span>
                  </div>
                  </div>
                  </div>
                ))}
                </Slider>
            ) : (
              <p className="text-center text-gray-600 mt-4">Žádné živé zápasy momentálně nejsou.</p>
            )}
          </div>
            <div className="mt-8"></div>
            <h2 className="text-2xl font-semibold">Nedávné výsledky</h2>
            {sortedGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedGames.map((game) => (
              <div key={game} className="mt-4">
              <h3 className="text-xl font-semibold">{game}</h3>
              <ul className="space-y-4 overflow-y-auto hide-scrollbar" style={{ maxHeight: '500px' }}>
                {recentResultsByGame[game]
                .sort((a: EsportsResult, b: EsportsResult) => new Date(b.begin_at).getTime() - new Date(a.begin_at).getTime())
                .slice(0, 5)
                .map((result: EsportsResult) => (
                <li key={result.id} className="bg-white p-4 rounded-lg shadow-md">
                <span className="text-center text-gray-400 block">{new Date(result.begin_at).toLocaleDateString()}</span>
                <p className="text-center text-gray-600">{result.league.name || 'Unknown League'} - {result.tournament.name || 'Unknown Tournament'}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col items-center">
                  {result.opponents[0].opponent.image_url && (
                  <Image
                  src={result.opponents[0].opponent.image_url}
                  alt={result.opponents[0].opponent.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                  />
                  )}
                  <span className="text-black text-sm mt-2">{result.opponents[0].opponent.name}</span>
                  </div>
                  <span className="text-black text-lg">{result.results[0].score} - {result.results[1].score}</span>
                  <div className="flex flex-col items-center">
                  {result.opponents[1].opponent.image_url && (
                  <Image
                  src={result.opponents[1].opponent.image_url}
                  alt={result.opponents[1].opponent.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                  />
                  )}
                  <span className="text-black text-sm mt
                  -2">{result.opponents[1].opponent.name}</span>
                  </div>
                </div>
                {result.results[0].score > result.results[1].score ? (
                  <p className="text-center text-green-500 mt-2">Vítěz: {result.opponents[0].opponent.name}</p>
                ) : (
                  <p className="text-center text-green-500 mt-2">Vítěz: {result.opponents[1].opponent.name}</p>
                )}
                </li>
                ))}
              </ul>
              </div>
              ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">Žádné nedávné výsledky nejsou k dispozici.</p>
            )}
          {esportPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">Esportové články</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {esportPosts.map((post) => (
                  <ArticleCard key={post.id} article={post} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EsportsPage;