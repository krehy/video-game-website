import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensure credentials are sent with requests
});

export const fetchArticles = async () => {
  try {
    const response = await axiosInstance.get('/posts/');
    return response.data;
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

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
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

export const fetchGameById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/games/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game by id (${id}):`, error.response ? error.response.data : error.message);
    return null; // Ujistěte se, že vrátíte null v případě chyby
  }
};


export const fetchProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product by id (${id}):`, error);
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
    const response = await axiosInstance.get('/reviewindex/');
    return response.data[0];  // Assuming there's only one ReviewIndexPage
  } catch (error) {
    console.error('Error fetching review index SEO:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchGameIndexSEO = async () => {
  try {
    const response = await axiosInstance.get('/gameindex/');
    return response.data[0];  // Assuming there's only one GameIndexPage
  } catch (error) {
    console.error('Error fetching game index SEO:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchProductIndexSEO = async () => {
  try {
    const response = await axiosInstance.get('/productindex/');
    return response.data[0];  // Assuming there's only one ProductIndexPage
  } catch (error) {
    console.error('Error fetching product index SEO:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchHomePageSEO = async () => {
  try {
    const response = await axiosInstance.get('/homepage/');
    return response.data[0];  // Assuming there's only one HomePage
  } catch (error) {
    console.error('Error fetching home page SEO:', error.response?.data || error.message);
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
      withCredentials: true,  // Ensure credentials are sent with requests
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
