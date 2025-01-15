import dynamic from 'next/dynamic';
import YazyLayout from './YazyLayout';

const GameLobby = dynamic(() => import('./components/GameLobby'), { ssr: false });

const LobbyPage = () => (
  <YazyLayout>
    <GameLobby />
  </YazyLayout>
);

export default LobbyPage;
