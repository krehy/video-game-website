// src/components/ActiveUsers.tsx

import React, { useState, useEffect } from 'react';
import { incrementActiveUsers, decrementActiveUsers } from '../services/api';
import { ActiveUsersProps } from '../types';

const ActiveUsers: React.FC<ActiveUsersProps> = ({ contentType, contentId }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Nyní jsme na klientské straně

    const handleIncrementActiveUsers = async () => {
      try {
        const activeUsersCount = await incrementActiveUsers(contentType, contentId);
        setActiveUsers(activeUsersCount);
      } catch (error) {
        console.error('Error incrementing active users:', error);
      }
    };

    const handleDecrementActiveUsers = async () => {
      try {
        const activeUsersCount = await decrementActiveUsers(contentType, contentId);
        setActiveUsers(activeUsersCount);
      } catch (error) {
        console.error('Error decrementing active users:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleDecrementActiveUsers();
      } else if (document.visibilityState === 'visible') {
        handleIncrementActiveUsers();
      }
    };

    handleIncrementActiveUsers();

    // Přidání události visibilitychange a beforeunload
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleDecrementActiveUsers);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleDecrementActiveUsers);
      handleDecrementActiveUsers();
    };
  }, [contentType, contentId]);

  // Podmíněné vykreslení, které zajistí, že se prvek vykreslí až po hydrataci
  if (!isClient) {
    return null;
  }

  return (
    <p className="text-sm text-gray-600 mb-4">
      <strong>{activeUsers}</strong> lidí právě čte.
    </p>
  );
};

export default ActiveUsers;
