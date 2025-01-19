// src/components/ArticleDetailPage/PinnedContent.tsx

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faGamepad, faTag } from '@fortawesome/free-solid-svg-icons';
import { PinnedContentProps } from '../../types';

const PinnedContent: React.FC<PinnedContentProps> = ({ linkedGame }) => {
  
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold flex items-center">
        <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
        Připnuto:
      </h2>
      <div className="flex flex-wrap mt-4">
        {linkedGame ? (
          <div className="mr-4 mb-4 flex items-center">
            <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
            <Link className="mr-2 text-[#8e67ea] text-lg" href={`/games/${linkedGame.slug}`}>
              {linkedGame.title}
            </Link>
          </div>
        ) : (
          <div className="mr-4 mb-4 text-lg text-red-500">
            Žádná hra není připnuta.
          </div>
        )}
        
      </div>
    </div>
  );
};

export default PinnedContent;
