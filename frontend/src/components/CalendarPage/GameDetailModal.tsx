import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { incrementSearchWeek } from '../../services/api';
import Image from 'next/image';
import { GameDetailModalProps } from '../../types';

const GameDetailModal: React.FC<GameDetailModalProps> = ({ isOpen, onClose, game }) => {
  useEffect(() => {
    if (isOpen && game) {
      const lastViewed = localStorage.getItem(`lastViewed_${game.id}`);
      const today = new Date().toISOString().split('T')[0];

      if (lastViewed !== today) {
        incrementSearchWeek(game.id)
          .then(data => {
            if (data) {
              console.log('Week search count:', data.search_week);
              localStorage.setItem(`lastViewed_${game.id}`, today);
            }
          })
          .catch(error => console.error('Error incrementing week search:', error));
      }
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  const today = dayjs();
  const releaseDate = dayjs(game.release_date);
  const daysUntilRelease = releaseDate.diff(today, 'day');

  const maxLength = 200;
  const truncatedDescription =
    game.description.length > maxLength
      ? game.description.substring(0, maxLength) + '...'
      : game.description;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-full max-w-md relative z-60"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {game.main_image && (
          <div className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_INDEX_URL}${game.main_image.url}`}
              alt={game.title}
              width={800} // Adjust according to your design
              height={300} // Adjust according to your design
              layout="responsive"
              objectFit="cover"
              className="rounded-t"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2">
              <h2 className="text-lg font-semibold">{game.title}</h2>
            </div>
          </div>
        )}

        <div className="text-black mb-4">
          <div
            dangerouslySetInnerHTML={{ __html: truncatedDescription }}
          />
          {game.description.length > maxLength && (
            <a
              href={`/games/${game.slug}`}
              className="text-purple-700"
              style={{ color: '#8e67ea' }}
            >
              Číst více
            </a>
          )}
        </div>
        {daysUntilRelease > 0 ? (
          <p className="mt-4 text-black">
            Hra vychází{' '}
            <span className="text-green-600">
              {releaseDate.format('DD.MM.YYYY')}
            </span>
              . To je za{' '}
            <span className="text-purple-700 text-4xl font-bold">
              {daysUntilRelease}
            </span>{' '}
            {daysUntilRelease === 1 ? 'den' : 'dní'}.
          </p>
        ) : (
          <p className="mt-4 text-green-600">Hra již vyšla</p>
        )}
        <div className="flex justify-end mt-4">
          <a
            href={`/games/${game.slug}`}
            className="px-4 py-2 rounded"
            style={{ backgroundColor: '#8e67ea', color: 'white' }}
          >
            Více informací
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameDetailModal;
