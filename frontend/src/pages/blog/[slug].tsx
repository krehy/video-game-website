import React, { useState, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { 
  fetchArticles, 
  fetchGameById, 
  incrementReadCount 
} from '../../services/api';
import ArticleHeader from '../../components/ArticleDetailPage/ArticleHeader';
import ArticleBody from '../../components/ArticleDetailPage/ArticleBody';
import ArticleSchema from '../../components/ArticleDetailPage/ArticleSchema';
import DarkModeToggle from '../../components/ArticleDetailPage/DarkModeToggle';
import PinnedContent from '../../components/ArticleDetailPage/PinnedContent';
import CommentShareLike from '../../components/CommentShareLike';
import ActiveUsers from '../../components/ActiveUsers';
import Image from 'next/image';
import { Article, GameLinkedItem } from '../../types';

interface ArticleDetailProps {
  article: Article;
  linkedGame?: GameLinkedItem | null;  // Upraveno na `null` jako možnou hodnotu
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, linkedGame }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readCount, setReadCount] = useState(article.read_count);
  
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  
    const incrementReadCountForArticle = async () => {
      try {
        const count = await incrementReadCount('article', article.id);
        if (count !== null) {
          setReadCount(count);
        }
      } catch (error) {
        console.error("Error incrementing read count:", error);
      }
    };

    incrementReadCountForArticle();
  }, [article.id]);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  if (!article) {
    return <div>Článek nenalezen</div>;
  }

  const cleanedUrlPath = article.url_path?.replace('/placeholder', '') || '';

  const options = {
    replace: (domNode: any) => {  // Typ `any` může být nahrazen konkrétním typem podle potřeby
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'media') {
        return (
          <div key={domNode.attribs.url} className="video-container">
            <iframe
              width="560"
              height="315"
              src={domNode.attribs.url.replace('watch?v=', 'embed/')}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      if (domNode.name === 'embed' && domNode.attribs.embedtype === 'image') {
        const imageUrl = `${process.env.NEXT_PUBLIC_INDEX_URL}/media/original_images/${domNode.attribs.alt}.jpg`;

        return (
          <Image
            key={domNode.attribs.id}
            src={imageUrl}
            alt={domNode.attribs.alt}
            width={800} // Adjust according to your layout
            height={600} // Adjust according to your layout
            layout="responsive"
            objectFit="cover"
            className={`embedded-image ${domNode.attribs.format}`}
          />
        );
      }
    },
  };

  return (
    <div className="container mx-auto p-4">
      <ArticleSchema article={article} cleanedUrlPath={cleanedUrlPath} />
      <ArticleHeader article={article} readCount={readCount} isDarkMode={isDarkMode} />
      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <ActiveUsers contentType="article" contentId={article.id} />
        <ArticleBody body={article.body || ''} isDarkMode={isDarkMode} options={options} />
        <PinnedContent linkedGame={linkedGame} />
        <CommentShareLike
          pageId={article.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
          title={article.title}
          contentType="article"
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const articles: Article[] = await fetchArticles(); 
    const paths = articles.map((article: Article) => ({
      params: { slug: article.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching articles for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps<ArticleDetailProps> = async ({ params }) => {
  try {
    const articles: Article[] = await fetchArticles();
    const article = articles.find((a) => a.slug === params?.slug);

    if (!article) {
      return {
        notFound: true,
      };
    }

    // Ujistěte se, že `linkedGame` je `GameLinkedItem | null`
    const linkedGame = article.linked_game ? await fetchGameById(article.linked_game).catch(() => null) : null;

    return {
      props: { 
        article: {
          ...article,
          like_count: article.like_count || 0,
          dislike_count: article.dislike_count || 0,
        },
        linkedGame,  // Ensure `linkedGame` is either an object or null
      },
      revalidate: 5, // Regenerate the page every 5 seconds
    };
  } catch (error) {
    console.error('Error fetching article for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ArticleDetail;
