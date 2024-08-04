// pages/games.js
import { useEffect, useState } from 'react';
import { fetchGames } from '../../services/api';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      const data = await fetchGames();
      setGames(data);
    };

    getGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Databáze her</h1>
      {games.length ? (
        <ul>
          {games.map(game => (
            <li key={game.id}>{game.title}</li>
          ))}
        </ul>
      ) : (
        <p>Načítání her...</p>
      )}
    </div>
  );
};

export default Games;
