import dynamic from 'next/dynamic';
import YazyLayout from './YazyLayout';

const GameBoard = dynamic(() => import('./components/GameBoard'), { ssr: false });

const GamePage = () => (
  <YazyLayout>
    <GameBoard />
  </YazyLayout>
);

export default GamePage;
