import React from 'react';
import { motion } from 'framer-motion';

const LoadingPlaceholder = () => {
  return (
    <div className="space-y-8">
      {/* Hlavní nadpis / Random Fact */}
      <div className="h-10 w-2/3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg animate-pulse"></div>

      {/* Aktuality Marquee Placeholder */}
      <div className="bg-white p-2 mt-4 mb-8 border rounded-lg shadow-md">
        <div className="h-6 w-3/4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Grid layout pro články a recenze */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hlavní články */}
        <div className="md:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="flex flex-col md:flex-row bg-gray-200 shadow-lg rounded-lg overflow-hidden animate-pulse"
            >
              {/* Obrázek článku */}
              <div className="relative w-full h-56 md:h-auto md:w-1/2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>

              {/* Obsah článku */}
              <div className="flex flex-col justify-between p-4 w-full md:w-1/2">
                <div>
                  <div className="h-6 bg-gray-400 w-3/4 rounded mb-2"></div>
                  <div className="h-4 bg-gray-400 w-1/2 rounded mb-4"></div>
                  <div className="h-4 bg-gray-400 w-full rounded mb-4"></div>
                  <div className="h-4 bg-gray-400 w-5/6 rounded"></div>
                </div>
                <div className="flex flex-wrap">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-400 w-16 rounded-full mr-2"></div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar - Nejnovější recenze, Nejoblíbenější článek, Sociální sítě */}
        <div className="md:col-span-1 space-y-6">
          <div className="h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg shadow-md animate-pulse"></div>
          <div className="h-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg shadow-md animate-pulse"></div>
          <div className="h-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg shadow-md animate-pulse"></div>
        </div>
      </div>

      {/* Nadcházející hry Placeholder */}
      <div className="mt-8 space-y-6">
        <div className="h-6 w-1/3 bg-gray-400 rounded mx-auto"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 bg-gray-200 p-4 rounded-lg animate-pulse"
          >
            <div className="h-24 w-16 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg"></div>
            <div className="flex flex-col">
              <div className="h-6 bg-gray-400 w-24 rounded mb-2"></div>
              <div className="h-4 bg-gray-400 w-16 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
