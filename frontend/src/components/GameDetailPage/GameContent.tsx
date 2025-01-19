import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GameContentProps } from '../../types'; // Adjust the import path as needed

const GameContent: React.FC<GameContentProps> = ({ game, isDarkMode }) => {
  const [parsedContent, setParsedContent] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    if (game.enriched_description) {
      const decodeHtmlEntities = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      };

      const decodedHtml = decodeHtmlEntities(game.enriched_description);

      const parser = new DOMParser();
      const doc = parser.parseFromString(decodedHtml, 'text/html');

      const content = Array.from(doc.body.childNodes)
        .map((node, index) => {
          if (node.nodeName === 'IMG') {
            const imgElement = node as HTMLImageElement;
            const src = imgElement.getAttribute('src');
            const alt = imgElement.getAttribute('alt') || '';
            if (src) {
              const fullSrc = `${process.env.NEXT_PUBLIC_INDEX_URL}${src}`;
              return (
                <Image
                  key={`image-${index}`}
                  src={fullSrc}
                  alt={alt}
                  layout="responsive"
                  width={560}
                  height={315}
                  className="rounded"
                  objectFit="cover"
                />
              );
            }
          } else if (node.nodeName === 'H2') {
            return (
              <h2 key={`h2-${index}`} className="text-xl font-bold mt-4">
                {node.textContent}
              </h2>
            );
          } else if (node.nodeName === 'H3') {
            return (
              <h3 key={`h3-${index}`} className="text-lg font-semibold mt-3">
                {node.textContent}
              </h3>
            );
          } else if (node.nodeName === 'P') {
            return (
              <p key={`p-${index}`} className="mb-4">
                {Array.from(node.childNodes).map((child, childIndex) => {
                  if (child.nodeName === 'B' || child.nodeName === 'STRONG') {
                    return (
                      <strong
                        key={`b-${index}-${childIndex}`}
                        className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}
                      >
                        {child.textContent}
                      </strong>
                    );
                  } else if (child.nodeName === 'I') {
                    return (
                      <em key={`i-${index}-${childIndex}`}>
                        {child.textContent}
                      </em>
                    );
                  } else if (child.nodeName === 'A') {
                    const href = (child as HTMLAnchorElement).getAttribute('href') || '#';
                    return (
                      <a
                        key={`a-${index}-${childIndex}`}
                        href={href}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {child.textContent}
                      </a>
                    );
                  }
                  return child.textContent;
                })}
              </p>
            );
          }
          return null;
        })
        .filter((element): element is JSX.Element => element !== null); // Filter out null values

      setParsedContent(content);
    } else {
      setParsedContent(null);
    }
  }, [game.enriched_description, isDarkMode]);

  if (!parsedContent) {
    return <div>No description available</div>;
  }

  return (
    <div
      className={`prose mb-4 break-words max-w-full mt-8 ${
        isDarkMode ? 'prose-dark' : 'prose-light'
      }`}
    >
      {parsedContent}
    </div>
  );
};

export default GameContent;