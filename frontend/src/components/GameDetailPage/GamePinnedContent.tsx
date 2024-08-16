import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faTag, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const GamePinnedContent = ({ game }) => (
  game.linked_blog_posts.length > 0 || game.linked_reviews.length > 0 ? (
    <div className="mt-6">
      <h2 className="text-2xl font-bold flex items-center">
        <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
        Připnuto:
      </h2>
      <div className="flex flex-wrap mt-4">
        {game.linked_blog_posts.map((article) => (
          <div key={article.id} className="mr-4 mb-4 flex items-center">
            <FontAwesomeIcon icon={faTag} className="mr-2 text-lg" />
            <Link className="mr-2 text-[#8e67ea] text-lg" href={`/blog/${article.slug}`}>
              {article.title}
            </Link>
          </div>
        ))}
        {game.linked_reviews.map((review) => (
          <div key={review.id} className="mr-4 mb-4 flex items-center">
            <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
            <Link className="mr-2 text-[#8e67ea] text-lg" href={`/reviews/${review.slug}`}>
              {review.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="mt-6">No related articles or reviews found.</p>
  )
);

export default GamePinnedContent;
