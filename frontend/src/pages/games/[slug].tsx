// pages/games/[slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchGames } from '../../services/api';

const GameDetail = ({ game }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: game.description }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const games = await fetchGames();
  const paths = games.map((game) => ({
    params: { slug: game.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const games = await fetchGames();
  const game = games.find((game) => game.slug === params.slug);
  return { props: { game } };
};

export default GameDetail;
