import React, { useState, useEffect } from 'react';
import { fetchComments, submitComment, likeArticle, dislikeArticle, likeReview, dislikeReview, likeProduct, dislikeProduct, likeGame, dislikeGame, fetchArticles, fetchReviews, fetchProducts, fetchGames } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment } from '@fortawesome/free-solid-svg-icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share';

const CommentShareLike = ({ pageId, shareUrl, title, contentType }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [showCommentForm, setShowCommentForm] = useState(true);
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem('commentAuthor');
    if (storedName) {
      setNewComment((prev) => ({ ...prev, author: storedName }));
    }
  }, []);

  useEffect(() => {
    const fetchCommentsData = async () => {
      try {
        const response = await fetchComments(pageId);
        setComments(response.filter(comment => comment.page === pageId && comment.is_approved));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchLikeDislikeCount = async () => {
      try {
        let item;
        switch (contentType) {
          case 'article':
            const articles = await fetchArticles();
            item = articles.find(article => article.id === pageId);
            break;
          case 'review':
            const reviews = await fetchReviews();
            item = reviews.find(review => review.id === pageId);
            break;
          case 'product':
            const products = await fetchProducts();
            item = products.find(product => product.id === pageId);
            break;
          case 'game':
            const games = await fetchGames();
            item = games.find(game => game.id === pageId);
            break;
          default:
            break;
        }

        if (item) {
          setLikeCount(item.like_count);
          setDislikeCount(item.dislike_count);
        }
      } catch (error) {
        console.error('Error fetching like/dislike count:', error);
      }
    };

    fetchCommentsData();
    fetchLikeDislikeCount();
  }, [pageId, contentType]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitComment({ ...newComment, page: pageId });
      setNewComment({ author: '', text: '' });
      setShowCommentForm(false);
      setShowSubmissionMessage(true);
      localStorage.setItem('commentAuthor', newComment.author);

      // Show submission message for 10 seconds
      setTimeout(() => {
        setShowSubmissionMessage(false);
        setShowCommentForm(true);
      }, 10000);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!hasRated) {
      try {
        let response;
        switch (contentType) {
          case 'article':
            response = rating === 'like' ? await likeArticle(pageId) : await dislikeArticle(pageId);
            break;
          case 'review':
            response = rating === 'like' ? await likeReview(pageId) : await dislikeReview(pageId);
            break;
          case 'product':
            response = rating === 'like' ? await likeProduct(pageId) : await dislikeProduct(pageId);
            break;
          case 'game':
            response = rating === 'like' ? await likeGame(pageId) : await dislikeGame(pageId);
            break;
          default:
            break;
        }

        if (response) {
          if (rating === 'like') {
            setLikeCount(response.like_count);
          } else {
            setDislikeCount(response.dislike_count);
          }
        }

        setUserRating(rating);
        setHasRated(true);
        localStorage.setItem(`rated-${pageId}`, true);
      } catch (error) {
        console.error('Error rating the item:', error);
      }
    }
  };

  useEffect(() => {
    const hasUserRated = localStorage.getItem(`rated-${pageId}`) === 'true';
    setHasRated(hasUserRated);
  }, [pageId]);

  return (
    <div>
      {comments.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FontAwesomeIcon icon={faComment} className="mr-2 text-[#8e67ea] text-lg" />
            Komentáře
          </h2>
          <div>
            {comments.map((comment, index) => (
              <div key={comment.id} className={`mb-4 pb-4 max-w-md ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                <div className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-[#251f68] text-white' : 'bg-[#8e67ea] text-white'}`}>
                  <p className="text-lg font-bold break-words">{comment.author}</p>
                  <p className="text-sm text-gray-200 break-words">{new Date(comment.created_at).toLocaleDateString()}</p>
                  <p className="break-words">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 text-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Sdílej a poděl se s přáteli:</h2>
        <div className="flex justify-center space-x-4 mb-6">
          <FacebookShareButton url={shareUrl} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <RedditShareButton url={shareUrl} title={title}>
            <RedditIcon size={40} round />
          </RedditShareButton>
          <EmailShareButton url={shareUrl} subject={title} body={title}>
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
      </div>
      {showSubmissionMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          Váš komentář byl úspěšně přidán a odeslán ke schválení. Děkujeme!
        </div>
      )}
      {showCommentForm && (
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <input
            type="text"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
            placeholder="Vaše jméno"
            required
            className="border border-gray-300 p-2 rounded mb-2 w-full text-black"
          />
          <textarea
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
            placeholder="Váš komentář"
            required
            className="border border-gray-300 p-2 rounded mb-2 w-full text-black"
          />
          <button type="submit" className="bg-[#251f68] text-white p-2 rounded">
            Odeslat komentář
          </button>
        </form>
      )}
      <div className="mt-6 text-center">
        <p className="text-xl font-bold">Hej hráči! Jak se vám líbil tento článek? Ohodnoťte ho!</p>
        <div className="flex justify-center space-x-4 mt-2">
          <button
            onClick={() => handleRating('like')}
            disabled={hasRated}
            className={`p-2 rounded ${hasRated ? 'bg-gray-400' : 'bg-green-500'} text-white`}
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span className="ml-2">{likeCount}</span>
          </button>
          <button
            onClick={() => handleRating('dislike')}
            disabled={hasRated}
            className={`p-2 rounded ${hasRated ? 'bg-gray-400' : 'bg-red-500'} text-white`}
          >
            <FontAwesomeIcon icon={faThumbsDown} />
            <span className="ml-2">{dislikeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentShareLike;
