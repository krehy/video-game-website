import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Review } from '../../types';

interface ReviewBodyProps {
  review: Review;
  isDarkMode: boolean;
}

const ReviewBody: React.FC<ReviewBodyProps> = ({ review, isDarkMode }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Set hydrated to true after the component has mounted
    setHydrated(true);
  }, []);

  const renderEnrichedContent = (html: string) => {
    try {
      // Decode HTML entities
      const decodedHtml = html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

      // Parse HTML string and render dynamically
      const parser = new DOMParser();
      const doc = parser.parseFromString(decodedHtml, 'text/html');

      const elements: JSX.Element[] = Array.from(doc.body.childNodes)
        .map((node, index) => {
          if (node.nodeName === 'IMG') {
            const imgElement = node as HTMLImageElement;
            const src = imgElement.getAttribute('src');
            const alt = imgElement.getAttribute('alt') || '';
            if (src) {
              const fullSrc = `${process.env.NEXT_PUBLIC_INDEX_URL}${src}`;
              return (
                <Image
                  key={`img-${index}`}
                  src={fullSrc}
                  alt={alt}
                  width={800}
                  height={450}
                  className="rounded"
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              );
            }
          } else if (node.nodeName === 'IFRAME') {
            const iframeElement = node as HTMLIFrameElement;
            const src = iframeElement.getAttribute('src');
            if (src) {
              return (
                <iframe
                  key={`iframe-${index}`}
                  width="560"
                  height="315"
                  src={src}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              );
            }
          } else if (node.nodeName === 'P') {
            return (
              <p key={`p-${index}`} className="mb-4">
                {Array.from(node.childNodes).map((child, childIndex) => {
                  if (child.nodeName === 'B' || child.nodeName === 'STRONG') {
                    return (
                      <strong
                        key={`strong-${index}-${childIndex}`}
                        className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}
                      >
                        {child.textContent}
                      </strong>
                    );
                  } else if (child.nodeName === 'I' || child.nodeName === 'EM') {
                    return (
                      <em
                        key={`em-${index}-${childIndex}`}
                        className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                      >
                        {child.textContent}
                      </em>
                    );
                  }
                  return child.textContent;
                })}
              </p>
            );
          } else if (node.nodeName === 'HR') {
            return <hr key={`hr-${index}`} />;
          }
          return null;
        })
        .filter((element): element is JSX.Element => element !== null); // Filter out null values

      return <>{elements}</>;
    } catch (error) {
      console.error('Error rendering enriched content:', error);
      return <div>Chyba při vykreslování obsahu</div>;
    }
  };

  if (!hydrated) {
    // Render nothing or a skeleton loader during hydration
    return <div>Loading...</div>;
  }

  return (
    <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
      {/* Render enriched_body */}
      {review.enriched_body && renderEnrichedContent(review.enriched_body)}

      {/* Render attributes */}
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
                    {attribute.score}/5
                  </div>
                  <div className="font-sans font-normal break-words mr-20">
                    {/* Render enriched_text */}
                    {attribute.enriched_text && renderEnrichedContent(attribute.enriched_text)}
                  </div>
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