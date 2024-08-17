import { useState, useEffect } from 'react';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL); // Připojení k Redis serveru

const ActiveUsers = ({ articleId }) => {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const updateUserCount = async () => {
      try {
        const currentCount = await redis.incr(`active_users:${articleId}`);
        setActiveUsers(currentCount);

        // Po uplynutí 10 minut (600 sekund) se záznam v Redis vyprší
        await redis.expire(`active_users:${articleId}`, 600);
      } catch (error) {
        console.error('Error updating active users count:', error);
      }
    };

    updateUserCount();

    // Decrement count when user leaves
    return () => {
      redis.decr(`active_users:${articleId}`);
    };
  }, [articleId]);

  return (
    <div className="text-sm text-gray-600">
      <strong>{activeUsers}</strong> uživatel(ů) právě čte tento článek.
    </div>
  );
};

export default ActiveUsers;
