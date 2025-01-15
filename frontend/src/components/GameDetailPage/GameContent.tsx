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

      const content = Array.from(doc.body.childNodes).map((node, index) => {
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
                width={800}
                height={450}
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
        } else if (node.nodeName === 'H4') {
          return (
            <h4 key={`h4-${index}`} className="text-md font-medium mt-2">
              {node.textContent}
            </h4>
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
        } else if (node.nodeName === 'OL') {
          const items = Array.from(node.childNodes)
            .filter((li) => li.nodeName === 'LI')
            .map((li, liIndex) => (
              <li key={`${index}-${liIndex}`} className="ml-5">
                {li.textContent}
              </li>
            ));
          return <ol key={`ol-${index}`} className="list-decimal mb-4">{items}</ol>;
        } else if (node.nodeName === 'UL') {
          const items = Array.from(node.childNodes)
            .filter((li) => li.nodeName === 'LI')
            .map((li, liIndex) => (
              <li key={`${index}-${liIndex}`} className="ml-5">
                {li.textContent}
              </li>
            ));
          return <ul key={`ul-${index}`} className="list-disc mb-4">{items}</ul>;
        } else if (node.nodeName === 'EMBED') {
          const embedElement = node as HTMLElement;
          const embedUrl = embedElement.getAttribute('url');
          if (embedUrl && embedUrl.includes('youtube.com')) {
            const videoId = new URL(embedUrl).searchParams.get('v');
            if (videoId) {
              return (
                <iframe
                  key={`youtube-${index}`}
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`YouTube video ${videoId}`}
                ></iframe>
              );
            }
          }
        }

        // Fallback for unknown elements
        if (node.textContent && node.textContent.trim() !== 'StructValue()') {
          return (
            <div
              key={`${index}`}
              dangerouslySetInnerHTML={{ __html: node.textContent }}
            />
          );
        }

        return null;
      });

      setParsedContent(content.filter(Boolean));
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
