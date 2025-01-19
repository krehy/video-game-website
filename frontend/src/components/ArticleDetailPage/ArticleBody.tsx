import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArticleBodyProps } from '../../types';

const ArticleBody: React.FC<ArticleBodyProps> = ({ enriched_body, isDarkMode }) => {
  const [parsedContent, setParsedContent] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    const loadAds = () => {
      if (window.sssp) {
        const adContainers = document.querySelectorAll('.ssp-ad-container');
        const adConfigs = Array.from(adContainers).map((container, index) => ({
          zoneId: 347254,
          id: container.id,
          width: 728,
          height: 90,
        }));

        window.sssp.getAds(adConfigs);
      } else {
        console.error('sssp is not available.');
      }
    };

    if (!window.sssp) {
      const script = document.createElement('script');
      script.src = 'https://ssp.seznam.cz/static/js/ssp.js';
      script.async = true;
      script.onload = () => {
        loadAds();
      };
      document.body.appendChild(script);
    } else {
      loadAds();
    }

    return () => {
      const script = document.querySelector('script[src="https://ssp.seznam.cz/static/js/ssp.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(enriched_body)) {
      const content = enriched_body.map((htmlBlock, index) => {
        if (!htmlBlock || typeof htmlBlock !== 'string') {
          console.error(`Invalid block in enriched_body at index ${index}:`, htmlBlock);
          return null;
        }

        if (htmlBlock.includes('table_caption')) {
          try {
            const normalizedHtmlBlock = htmlBlock
              .replace(/'/g, '"')
              .replace(/None/g, 'null')
              .replace(/True/g, 'true')
              .replace(/False/g, 'false');

            const tableData = JSON.parse(normalizedHtmlBlock);
            const { data, table_caption, first_row_is_table_header, first_col_is_header } = tableData;

            if (!Array.isArray(data) || data.length === 0) {
              return <p key={`table-${index}`}>No table data available</p>;
            }

            const filteredRows = data.filter((row: (string | null)[]) => 
              row.some((cell: string | null) => cell !== null && cell !== '')
            );
            
            const columnCount = filteredRows[0]?.length || 0;
            const nonEmptyColumnIndices = Array.from({ length: columnCount }, (_, colIndex) =>
              filteredRows.some((row: (string | null)[]) => row[colIndex] !== null && row[colIndex] !== '') ? colIndex : null
            ).filter((index): index is number => index !== null);
            
            const rows = filteredRows.map((row: (string | null)[], rowIndex: number) => (
              <tr key={`row-${rowIndex}`}>
                {nonEmptyColumnIndices.map((colIndex) => {
                  const cellContent = row[colIndex] || '';
                  const isHeaderRow = first_row_is_table_header && rowIndex === 0;
                  const isHeaderCol = first_col_is_header && colIndex === 0;
            
                  if (isHeaderRow || isHeaderCol) {
                    return (
                      <th
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="border px-4 py-2 bg-gray-200 font-bold"
                      >
                        {cellContent}
                      </th>
                    );
                  }
            
                  return (
                    <td
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="border px-4 py-2"
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ));
            
            return (
              <div key={`table-${index}`} className="overflow-auto mb-4">
                {table_caption && <div className="font-semibold mb-2 text-center">{table_caption}</div>}
                <table className="table-auto border-collapse border border-gray-500 w-full">
                  <tbody>{rows}</tbody>
                </table>
              </div>
            );
          } catch (error) {
            console.error('Error parsing table data:', error);
            return <p key={`table-${index}`}>Error rendering table</p>;
          }
        }

        const decodeHtmlEntities = (text: string) => {
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          return textarea.value;
        };

        const decodedHtml = decodeHtmlEntities(htmlBlock);

        const parser = new DOMParser();
        const doc = parser.parseFromString(decodedHtml, 'text/html');

        const elements: JSX.Element[] = Array.from(doc.body.childNodes)
          .map((node, childIndex) => {
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
                    className="rounded object-cover"
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
                    } else if (child.nodeName === 'I' || child.nodeName === 'EM') {
                      return (
                        <em
                          key={`${index}-${childIndex}-${inlineIndex}`}
                          className={`italic ${isDarkMode ? 'text-white' : 'text-black'}`}
                        >
                          {child.textContent}
                        </em>
                      );
                    } else if (child.nodeName === 'A') {
                      const anchor = child as HTMLAnchorElement;
                      return (
                        <a
                          key={`${index}-${childIndex}-${inlineIndex}`}
                          href={anchor.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {anchor.textContent}
                        </a>
                      );
                    }
                    return child.textContent;
                  })}
                </p>
              );
            } else if (node.nodeName === 'UL' || node.nodeName === 'OL') {
              const isOrdered = node.nodeName === 'OL';
              const items = Array.from(node.childNodes)
                .filter((li) => li.nodeName === 'LI')
                .map((li, liIndex) => (
                  <li key={`${index}-${childIndex}-${liIndex}`} className="ml-5">
                    {li.textContent}
                  </li>
                ));
              return isOrdered ? (
                <ol key={`${index}-${childIndex}`} className="list-decimal mb-4">
                  {items}
                </ol>
              ) : (
                <ul key={`${index}-${childIndex}`} className="list-disc mb-4">
                  {items}
                </ul>
              );
            } else if (node.nodeName === 'EMBED') {
              const embed = node as HTMLElement;
              const embedType = embed.getAttribute('embedtype');
              const url = embed.getAttribute('url');
              if (embedType === 'media' && url) {
                const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
                const iframeSrc = isYouTube
                  ? url.replace('/watch?v=', '/embed/')
                  : url;

                return (
                  <iframe
                    key={`iframe-${index}`}
                    width="560"
                    height="315"
                    src={iframeSrc}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                );
              }
            } else if (htmlBlock.includes('advertisement')) {
              const adId = `ssp-zone-347254-${index}`;
              return (
                <div key={`ad-${index}`} className="text-center my-4">
                  <div id={adId} className="ssp-ad-container"></div>
                </div>
              );
            }

            if (node.textContent && node.textContent.trim() !== 'StructValue()') {
              return (
                <div
                  key={`${index}-${childIndex}`}
                  dangerouslySetInnerHTML={{ __html: node.textContent }}
                />
              );
            }

            return null;
          })
          .filter((element): element is JSX.Element => element !== null);

        return <div key={index}>{elements}</div>;
      });

      setParsedContent(
        content.filter((item): item is JSX.Element => item !== null)
      );
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
