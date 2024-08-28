import React, { useEffect } from 'react';
import { ArticleBodyProps } from '../../types';

interface ParagraphBlock {
  type: 'paragraph';
  id: string;
  value: string;
}

interface AdvertisementBlock {
  type: 'advertisement';
  id: string;
  value: Record<string, never>;
}

type ContentBlock = ParagraphBlock | AdvertisementBlock;

const ArticleBody: React.FC<ArticleBodyProps> = ({ body, isDarkMode }) => {
  let content: ContentBlock[] = [];

  if (Array.isArray(body)) {
    content = body as ContentBlock[];
  } else if (typeof body === 'string') {
    try {
      content = JSON.parse(body) as ContentBlock[];
    } catch (error) {
      console.error('Error parsing body JSON:', error);
    }
  }

  useEffect(() => {
    function loadAds() {
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
    }

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

  const replaceEmbedWithIframe = (htmlString: string) => {
    return htmlString.replace(/<embed embedtype="media" url="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)".*?>/g, (match, videoId) => {
      return `
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>`;
    });
  };

  return (
    <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          const processedHtml = replaceEmbedWithIframe(block.value);
          return (
            <div key={block.id} dangerouslySetInnerHTML={{ __html: processedHtml }} />
          );
        }

        if (block.type === 'advertisement') {
          const adId = `ssp-zone-347254-${index}`;
          return (
            <div key={block.id}>
              <div id={adId} className="ssp-ad-container" style={{ textAlign: 'center', margin: '20px 0' }}></div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ArticleBody;
