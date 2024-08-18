import React from 'react';

// Define the type for a single pro or con
interface ProCon {
  text: string;
}

// Define the props interface
interface ReviewProsConsProps {
  pros?: ProCon[]; // Optional array of pros
  cons?: ProCon[]; // Optional array of cons
}

const ReviewProsCons: React.FC<ReviewProsConsProps> = ({ pros, cons }) => {
  return (
    <div className="pros-cons-grid grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Klady</h2>
        <ul className="list-none text-green-500 font-sans">
          {pros && Array.isArray(pros) && pros.length > 0 ? (
            pros.map((pro, index) => (
              <li key={index} className="mb-2">{pro.text}</li>
            ))
          ) : (
            <li>Žádné klady nejsou k dispozici</li>
          )}
        </ul>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Zápory</h2>
        <ul className="list-none text-red-500 font-sans">
          {cons && Array.isArray(cons) && cons.length > 0 ? (
            cons.map((con, index) => (
              <li key={index} className="mb-2">{con.text}</li>
            ))
          ) : (
            <li>Žádné zápory nejsou k dispozici</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReviewProsCons;
