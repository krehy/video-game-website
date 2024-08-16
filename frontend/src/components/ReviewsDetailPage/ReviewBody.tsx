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
              <div className="relative flex-grow break-words" style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                <h3 className="text-lg font-normal break-words">{attribute.name}</h3>
                <div className="relative">
                  <div
                    className="inline-block"
                    style={{
                      float: 'right',
                      width: '4.5rem',
                      marginLeft: '1rem',
                      textAlign: 'center',
                      backgroundColor: '#8e67ea',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '2rem',
                      lineHeight: '3rem',
                    }}
                  >
                    {attribute.score}/10
                  </div>
                  <p className="font-sans break-words font-normal" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', marginRight: '5rem' }}>
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
