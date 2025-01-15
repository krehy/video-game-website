import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArticleBodyProps } from '../../types';

const ArticleBody: React.FC<ArticleBodyProps> = ({ enriched_body, isDarkMode }) => {
  const [parsedContent, setParsedContent] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    if (Array.isArray(enriched_body)) {
      const content = enriched_body.map((htmlBlock, index) => {
        if (!htmlBlock || typeof htmlBlock !== 'string') {
          console.error(`Invalid block in enriched_body at index ${index}:`, htmlBlock);
          return null;
        }

        // Dekódování HTML entit
        const decodeHtmlEntities = (text: string) => {
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          return textarea.value;
        };

        const decodedHtml = decodeHtmlEntities(htmlBlock);

        // Analýza HTML obsahu
        const parser = new DOMParser();
        const doc = parser.parseFromString(decodedHtml, 'text/html');

        // Zpracování každého elementu v HTML
        const elements: JSX.Element[] = Array.from(doc.body.childNodes).map((node, childIndex) => {
          if (node.nodeName === 'IMG') {
            const imgElement = node as HTMLImageElement;
            const src = imgElement.getAttribute('src');
            const alt = imgElement.getAttribute('alt') || '';
            if (src) {
              const fullSrc = `${process.env.NEXT_PUBLIC_INDEX_URL}${src}`;
              return (
                <Image
                  key={`${index}-${childIndex}`}
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
              <h2 key={`${index}-${childIndex}`} className="text-xl font-bold mt-4">
                {node.textContent}
              </h2>
            );
          } else if (node.nodeName === 'H3') {
            return (
              <h3 key={`${index}-${childIndex}`} className="text-lg font-semibold mt-3">
                {node.textContent}
              </h3>
            );
          } else if (node.nodeName === 'H4') {
            return (
              <h4 key={`${index}-${childIndex}`} className="text-md font-medium mt-2">
                {node.textContent}
              </h4>
            );
          } else if (node.nodeName === 'P') {
            return (
              <p key={`${index}-${childIndex}`} className="mb-4">
                {Array.from(node.childNodes).map((child, inlineIndex) => {
                  if (child.nodeName === 'B' || child.nodeName === 'STRONG') {
                    return (
                      <strong
                        key={`${index}-${childIndex}-${inlineIndex}`}
                        className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}
                      >
                        {child.textContent}
                      </strong>
                    );
                  } else if (child.nodeName === 'I') {
                    return (
                      <em key={`${index}-${childIndex}-${inlineIndex}`}>
                        {child.textContent}
                      </em>
                    );
                  } else if (child.nodeName === 'A') {
                    const href = (child as HTMLAnchorElement).getAttribute('href') || '#';
                    return (
                      <a
                        key={`${index}-${childIndex}-${inlineIndex}`}
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
                <li key={`${index}-${childIndex}-${liIndex}`} className="ml-5">
                  {li.textContent}
                </li>
              ));
            return <ol key={`${index}-${childIndex}`} className="list-decimal mb-4">{items}</ol>;
          } else if (node.nodeName === 'UL') {
            const items = Array.from(node.childNodes)
              .filter((li) => li.nodeName === 'LI')
              .map((li, liIndex) => (
                <li key={`${index}-${childIndex}-${liIndex}`} className="ml-5">
                  {li.textContent}
                </li>
              ));
            return <ul key={`${index}-${childIndex}`} className="list-disc mb-4">{items}</ul>;
          } else if (node.nodeName === 'EMBED') {
            const embedElement = node as HTMLElement;
            const embedUrl = embedElement.getAttribute('url');
            if (embedUrl?.includes('youtube.com')) {
              const videoId = new URL(embedUrl).searchParams.get('v');
              if (videoId) {
                return (
                  <iframe
                    key={`${index}-${childIndex}`}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                );
              }
            }
          }

          // Fallback pro neznámé elementy
          if (node.textContent && node.textContent.trim() !== 'StructValue()') {
            return (
              <div
                key={`${index}-${childIndex}`}
                dangerouslySetInnerHTML={{ __html: node.textContent }}
              />
            );
          }

          return null;
        });

        return <div key={index}>{elements}</div>;
      });

      setParsedContent(content.filter(Boolean)); // Odstraníme null hodnoty
    } else {
      console.error('enriched_body is not an array or is missing:', enriched_body);
    }
  }, [enriched_body, isDarkMode]);

  if (!parsedContent) {
    return <div>Chyba při načítání obsahu článku.</div>;
  }

  return (
    <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
      {parsedContent}
    </div>
  );
};

export default ArticleBody;
