import React from 'react';
import parse from 'html-react-parser';

const ReviewBody = ({ review, isDarkMode }) => {
  return (
    <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
      {parse(review.body)}
      {review.attributes && review.attributes.length > 0 && (
        <div className="mt-4">
          {review.attributes.map((attribute, index) => (
            <div key={index} className="mb-8 flex items-start space-x-4 border-b pb-4">
              <div className="relative flex-grow break-words">
              <h3 className="text-lg font-sans font-extrabold break-words">{attribute.name}</h3>
              <div className="relative">
                  <div
                    className="inline-block float-right ml-4 text-center bg-[#8e67ea] text-white rounded-full font-normal text-2xl leading-10 whitespace-nowrap"
                    style={{ width: '4.5rem' }}
                  >
                    {attribute.score}/10
                  </div>
                  <p className="font-sans font-normal break-words mr-20">
                    {attribute.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewBody;
