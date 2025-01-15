import axios, { AxiosError } from 'axios';
import { Article, GameLinkedItem } from '../types'; // Adjust the import path as needed

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Ensure credentials are sent with requests
});

export const fetchAktuality = async () => {
  try {
    const response = await axiosInstance.get('/aktuality/');
    return response.data;
  } catch (error) {
    console.error('Error fetching aktuality:', error);
    return [];
  }
};


export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const response = await axiosInstance.get('/posts/');
    return response.data as Article[]; // Type assertion
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};


export const fetchReviews = async () => {
  try {
    const response = await axiosInstance.get('/reviews/');
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchGames = async () => {
  try {
    const response = await axiosInstance.get('/games/');
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchGameById = async (id: number): Promise<GameLinkedItem> => {
  try {
    const response = await axiosInstance.get(`/games/${id}/`);
    return response.data as GameLinkedItem;
  } catch (error) {
    console.error(`Error fetching game by ID ${id}:`, error);
    throw error;
  }
};




export const fetchArticlesByGameId = async (gameId: number) => {
  try {
    const response = await axiosInstance.get(`/posts/?linked_game=${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles linked to game (${gameId}):`, error);
    throw error;
  }
};

export const fetchReviewsByGameId = async (gameId: number) => {
  try {
    const response = await axiosInstance.get(`/reviews/?linked_game=${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews linked to game (${gameId}):`, error);
    throw error;
  }
};

export const submitContactMessage = async (messageData: any) => {
  try {
    const response = await axiosInstance.post('/contact_message/', messageData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
};


export const fetchBlogIndexSEO = async () => {
  try {
    const response = await axiosInstance.get('/blogindex/');
    return response.data[0];  // Assuming there's only one BlogIndexPage
  } catch (error) {
    console.error('Error fetching blog index SEO:', error);
    throw error;
  }
};

export const fetchReviewIndexSEO = async () => {
  try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviewindex/`);
      return response.data[0];
  } catch (error) {
      console.error('Error fetching review index SEO:', error);
      throw error;
  }
};

export const fetchGameIndexSEO = async () => {
  try {
    const response = await axiosInstance.get('/gameindex/');
    return response.data[0];  // Assuming there's only one GameIndexPage
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching game index SEO:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};


export const fetchHomePageSEO = async () => {
  try {
    const response = await axiosInstance.get('/homepage/');
    return response.data;  // Returns the entire HomePage object
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching home page SEO:', axiosError.response?.data || axiosError.message);
    throw error;
  }
};


export const fetchHomePageContent = async () => {
  try {
    const response = await axiosInstance.get('/homepage-content/');
    return response.data;
  } catch (error) {
    console.error('Error fetching home page content:', error);
    throw error;
  }
};

export const fetchComments = async (pageId: string) => {
  try {
    const response = await axiosInstance.get(`/comments/?page=${pageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const submitComment = async (comment: any) => {
  try {
    const response = await axiosInstance.post('/comments/', comment);
    return response.data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};

export const likeArticle = async (articleId: number) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${articleId}/like/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error liking article:', error);
    throw error;
  }
};

export const dislikeArticle = async (articleId: number) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${articleId}/dislike/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error disliking article:', error);
    throw error;
  }
};

export const likeReview = async (reviewId: number) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/like/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error liking review:', error);
    throw error;
  }
};

export const dislikeReview = async (reviewId: number) => {
  try {
    const response = await axios.post(`${API_URL}/reviews/${reviewId}/dislike/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error disliking review:', error);
    throw error;
  }
};

export const likeProduct = async (productId: number) => {
  try {
    const response = await axios.post(`${API_URL}/products/${productId}/like/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error liking product:', error);
    throw error;
  }
};

export const dislikeProduct = async (productId: number) => {
  try {
    const response = await axios.post(`${API_URL}/products/${productId}/dislike/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error disliking product:', error);
    throw error;
  }
};

export const likeGame = async (gameId: number) => {
  try {
    const response = await axios.post(`${API_URL}/games/${gameId}/like/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error liking game:', error);
    throw error;
  }
};

export const dislikeGame = async (gameId: number) => {
  try {
    const response = await axios.post(`${API_URL}/games/${gameId}/dislike/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    console.error('Error disliking game:', error);
    throw error;
  }
};

export const incrementReadCount = async (contentType: string, id: number) => {
  const key = `${contentType}_${id}_read`;

  if (!localStorage.getItem(key)) {
    try {
      const response = await axiosInstance.post(`/increment-read-count/${contentType}/${id}/`);
      localStorage.setItem(key, 'true');
      return response.data.read_count;
    } catch (error) {
      console.error('Error incrementing read count:', error);
      return null;
    }
  }
  return null;
};

export const incrementActiveUsers = async (contentType: string, contentId: number) => {
  try {
    const response = await axios.post(`${API_URL}/increment-active-users/${contentType}/${contentId}/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data.active_users;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error incrementing active users for ${contentType} (${contentId}):`, axiosError.response ? axiosError.response.data : axiosError.message);
    throw error;
  }
};

export const decrementActiveUsers = async (contentType: string, contentId: number) => {
  try {
    const response = await axios.post(`${API_URL}/decrement-active-users/${contentType}/${contentId}/`, null, {
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data.active_users;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error decrementing active users for ${contentType} (${contentId}):`, axiosError.response ? axiosError.response.data : axiosError.message);
    throw error;
  }
};

export const fetchActiveUsers = async (contentType: string, contentId: number) => {
  try {
    const response = await axiosInstance.get(`/active-users/${contentType}/${contentId}/`);
    return response.data.active_users;
  } catch (error) {
    console.error(`Error fetching active users for ${contentType} (${contentId}):`, error);
    throw error;
  }
};

export const fetchTopMostRead = async (contentType: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/top-most-read/${contentType}/`);

  if (!response.ok) {
    throw new Error('Failed to fetch top most-read content');
  }
  return response.json();
};

export const incrementSearchWeek = async (gameId: number) => {
  try {
    const response = await axios.post(`${API_URL}/increment-search-week/${gameId}/`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,  // Ensure credentials are sent with requests
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error incrementing search_week:', axiosError.response ? axiosError.response.data : axiosError.message);
    return null;
  }
};

export const fetchMostSearchedGame = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/most-searched-game-week/`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching most searched game:', axiosError.response ? axiosError.response.data : axiosError.message);
    return null;
  }
};
