import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import parse from 'html-react-parser';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchReviews, fetchGameById, fetchProductById, incrementReadCount } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faSun, faMoon, faTag, faThumbtack, faGamepad, faEye } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CommentShareLike from '../../components/CommentShareLike';
import Tilt from 'react-parallax-tilt';
import SvgSpider from '../../components/SvgSpider';
import { useSpring, animated } from '@react-spring/web';

const reviewTypeTranslations = {
  'Game': 'Hra',
  'Keyboard': 'Klávesnice',
  'Mouse': 'Myš',
  'Monitor': 'Monitor',
  'Computer': 'Počítač',
  'Headphones': 'Sluchátka',
  'Console': 'Konzole',
  'Mobile': 'Mobil',
  'Notebook': 'Notebook',
  'Microphone': 'Mikrofon'
};

const ReviewDetail = ({ review, linkedGame, linkedProduct }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readCount, setReadCount] = useState(review.read_count);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);

    const incrementReadCountForReview = async () => {
      const count = await incrementReadCount('review', review.id);
      if (count !== null) {
        setReadCount(count);
      }
    };

    incrementReadCountForReview();
  }, [review.id]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  if (!review) {
    return <div>Recenze nenalezena</div>;
  }

  const cleanedUrlPath = review.url_path.replace('/placeholder', '');

  const reviewTypeMap = {
    Game: 'VideoGame',
    Keyboard: 'Product',
    Mouse: 'Product',
    Monitor: 'Product',
    Computer: 'Product',
    Headphones: 'Product',
    Console: 'Product',
    Mobile: 'Product',
    Notebook: 'Product',
    Microphone: 'Product',
  };

  const reviewItemType = reviewTypeMap[review.review_type] || 'Product';

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': reviewItemType,
      name: review.title,
      image: review.main_image ? `${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}` : '',
    },
    author: {
      '@type': 'Person',
      name: review.owner.username,
    },
    reviewBody: review.body,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
    },
    datePublished: review.first_published_at,
    dateModified: review.last_published_at,
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Recenze',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/reviews`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: review.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`,
      },
    ],
  };

  const labels = review.attributes.map(attr => attr.name);
  const averageScore = review.attributes.reduce((acc, attribute) => acc + attribute.score, 0) / review.attributes.length;

  const AnimatedNumber = ({ number, inView }) => {
    const { num } = useSpring({
      from: { num: 0 },
      num: inView ? number : 0,
      config: { mass: 1, tension: 280, friction: 120 },
    });
    return <animated.span>{num.to((n) => (number % 1 === 0 ? n.toFixed(0) : n.toFixed(1)))}</animated.span>;
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{review.seo_title || review.title}</title>
        <meta name="description" content={review.search_description} />
        {review.keywords && <meta name="keywords" content={review.keywords} />}
        <meta property="og:title" content={review.seo_title || review.title} />
        <meta property="og:description" content={review.search_description} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`} />
        <meta property="og:type" content="article" />
        {review.main_image && <meta property="og:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={review.seo_title || review.title} />
        <meta name="twitter:description" content={review.search_description} />
        {review.main_image && <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      </Head>
      <h1 className="text-3xl font-bold mb-4 break-words">{review.title}</h1>
      {review.main_image && (
        <div className="relative mb-4">
          <img src={`${process.env.NEXT_PUBLIC_INDEX_URL}${review.main_image.url}`} alt={review.title} className="w-full h-auto object-cover rounded" />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 rounded hidden md:block">
            <p className="mb-2 break-words">{review.intro}</p>
            <div className="flex items-center text-sm mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
              <span className="mr-4 break-words">{review.owner.username}</span>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
              <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
              <FontAwesomeIcon icon={faEye} className="mr-2 text-[#8e67ea] text-lg" style={{marginLeft:'15'}} />
              <span>{readCount}</span>
            </div>
            <div className="flex flex-wrap">
              <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 break-words">
                {reviewTypeTranslations[review.review_type]}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Intro text below image for mobile */}
      <div className="block md:hidden p-4 bg-black bg-opacity-50 text-white rounded mb-4">
        <p className="mb-2 break-words">{review.intro}</p>
        <div className="flex items-center text-sm mb-2">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-[#8e67ea] text-lg" />
          <span className="mr-4 break-words">{review.owner.username}</span>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#8e67ea] text-lg" />
          <span>{new Date(review.first_published_at).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap">
          <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 break-words">
            {reviewTypeTranslations[review.review_type]}
          </span>
        </div>
      </div>
      <div className={`p-4 rounded relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-black'}`}>
        <div className="absolute top-4 right-4 flex items-center">
          <FontAwesomeIcon icon={faSun} className={`mr-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              style={{ top: '-4px', left: isDarkMode ? '24px' : '4px' }}
            />
            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
          <FontAwesomeIcon icon={faMoon} className={`ml-2 text-lg ${isDarkMode ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <div className={`prose mb-4 break-words max-w-full mt-8 ${isDarkMode ? 'prose-dark' : 'prose-light'}`}>
          {parse(review.body)}
        </div>
        {review.attributes && review.attributes.length > 0 && (
          <div className="mt-4">
            {review.attributes.map((attribute, index) => (
              <div key={index} className="mb-8 flex items-start space-x-4 border-b pb-4">
                <div className="relative flex-grow break-words" style={{ overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                  <h3 className="text-lg font-normal break-words">{attribute.name}</h3>
                  <div className="relative">
                    <div
                      className="inline-block"
                      style={{
                        float: 'right',
                        width: '4.5rem',
                        marginLeft: '1rem',
                        textAlign: 'center',
                        backgroundColor: '#8e67ea',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '2rem',
                        lineHeight: '3rem',
                      }}
                    >
                      {attribute.score}/10
                    </div>
                    <p className="font-sans break-words font-normal" style={{ wordBreak: 'break-all', overflowWrap: 'break-word', marginRight: '5rem' }}>
                      {attribute.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-4 text-center">Závěr</h2>
        {review.attributes.length === 5 && (
          <Tilt>
            <SvgSpider scores={review.attributes.map(attr => attr.score)} aspects={review.attributes.map(attr => attr.name)} isDarkMode={isDarkMode} />
          </Tilt>
        )}
        <div className="text-3xl font-bold text-center mt-8" style={{ color: isDarkMode ? 'white' : 'black' }}>
          <span>Celkové skóre:</span> <span style={{ fontSize: '4rem', color: '#8e67ea' }}><AnimatedNumber number={averageScore} inView={true} /></span>
        </div>
        <div className="pros-cons-grid grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Klady</h2>
            <ul className="list-none text-green-500 font-sans">
              {review.pros.map((pro, index) => (
                <li key={index} className="mb-2">{pro.text}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Zápory</h2>
            <ul className="list-none text-red-500 font-sans">
              {review.cons.map((con, index) => (
                <li key={index} className="mb-2">{con.text}</li>
              ))}
            </ul>
          </div>
        </div>
        {(linkedGame || linkedProduct) && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FontAwesomeIcon icon={faThumbtack} className="mr-2 text-[#8e67ea] text-lg" />
              Připnuto:
            </h2>
            <div className="flex flex-wrap mt-4">
              {linkedGame && (
                <div className="mr-4 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faGamepad} className="mr-2 text-lg" />
                  <Link className="mr-2 text-[#8e67ea] text-lg" href={`/games/${linkedGame.slug}`}>
                    {linkedGame.title}
                  </Link>
                </div>
              )}
              {linkedProduct && (
                <div className="mr-4 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-lg" />
                  <Link className="mr-2 text-[#8e67ea] text-lg" href={`/eshop/${linkedProduct.slug}`}>
                    {linkedProduct.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        <CommentShareLike
          pageId={review.id}
          shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}${cleanedUrlPath}`}
          title={review.title}
          contentType="review"
        />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const reviews = await fetchReviews();
    const paths = reviews.map((review) => ({
      params: { slug: review.slug },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching reviews for paths:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const reviews = await fetchReviews();
    const review = reviews.find((r) => r.slug === params?.slug);

    if (!review) {
      return {
        notFound: true,
      };
    }

    const linkedGame = review.linked_game ? await fetchGameById(review.linked_game) : null;
    const linkedProduct = review.linked_product ? await fetchProductById(review.linked_product) : null;

    return {
      props: {
        review: {
          ...review,
          like_count: review.like_count || 0,
          dislike_count: review.dislike_count || 0,
        },
        linkedGame,
        linkedProduct,
      },
    };
  } catch (error) {
    console.error('Error fetching review for static props:', error);
    return {
      notFound: true,
    };
  }
};

export default ReviewDetail;
