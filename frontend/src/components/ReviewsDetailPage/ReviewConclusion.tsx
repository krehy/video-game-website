import React from 'react';
import Tilt from 'react-parallax-tilt';
import SvgSpider from '../../components/SvgSpider';
import AnimatedNumber from './AnimatedNumber';

const ReviewConclusion = ({ review, averageScore, isDarkMode }) => {
  return (
    <>
      {review.attributes.length === 5 && (
        <Tilt>
          <SvgSpider scores={review.attributes.map(attr => attr.score)} aspects={review.attributes.map(attr => attr.name)} isDarkMode={isDarkMode} />
        </Tilt>
      )}
      <div className="text-3xl font-bold text-center mt-8" style={{ color: isDarkMode ? 'white' : 'black' }}>
        <span>Celkové skóre:</span> <span style={{ fontSize: '4rem', color: '#8e67ea' }}><AnimatedNumber number={averageScore} inView={true} /></span>
      </div>
    </>
  );
};

export default ReviewConclusion;