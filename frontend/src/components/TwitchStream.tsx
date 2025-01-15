import { useState, useEffect } from 'react';
import { isUserLive } from '../services/twitch';

const TwitchStream = () => {
  const [streamInfo, setStreamInfo] = useState<any>(null);

  useEffect(() => {
    const fetchStreamInfo = async () => {
      const stream = await isUserLive();
      setStreamInfo(stream);
    };

    fetchStreamInfo();
    const interval = setInterval(fetchStreamInfo, 60000); // Kontrolovat každou minutu
    return () => clearInterval(interval);
  }, []);

  if (!streamInfo) {
    return null; // Pokud není stream, komponenta se nevykreslí
  }


  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2"> 🔴 Jsme právě Live na Twitchi!</h2>
      <iframe
        src={`https://player.twitch.tv/?channel=${streamInfo.user_name}&parent=${window.location.hostname}`}
        height="300"
        width="100%"
        allowFullScreen={true}
        frameBorder="0"
      ></iframe>
      <p className="mt-2 text-sm">{streamInfo.title}</p>
    </div>
  );
};

export default TwitchStream;
