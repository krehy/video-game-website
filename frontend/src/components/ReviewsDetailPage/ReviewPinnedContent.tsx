import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { GameLinkedItem } from '../../types'; // Update import to match the defined types

interface ReviewPinnedContentProps {
  linkedGame?: GameLinkedItem | null; // Adjusted to allow null
}

const ReviewPinnedContent: React.FC<ReviewPinnedContentProps> = ({ linkedGame }) => {
  if (!linkedGame) return null; // Return null if there's no linked game

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold flex items-center">
        <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
        Připnuto:
      </h2>
      <div className="flex flex-wrap mt-4">
        <div className="mr-4 mb-4 flex items-center">
          <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
          <Link className="mr-2 text-[#8e67ea] text-lg" href={`/games/${linkedGame.slug}`}>
            {linkedGame.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReviewPinnedContent;
