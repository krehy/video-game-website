import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/games/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchGameById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/games/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game by id:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw error;
  }
};

export const fetchBlogIndexSEO = async () => {
  try {
    const response = await axios.get(`${API_URL}/blogindex/`);
    return response.data[0];  // Assuming there's only one BlogIndexPage
  } catch (error) {
    console.error('Error fetching blog index SEO:', error);
    throw error;
  }
};

export const fetchReviewIndexSEO = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviewindex/`);
    return response.data[0];  // Assuming there's only one ReviewIndexPage
  } catch (error) {
    console.error('Error fetching review index SEO:', error);
    throw error;
  }
};

export const fetchGameIndexSEO = async () => {
  try {
    const response = await axios.get(`${API_URL}/gameindex/`);
    return response.data[0];  // Assuming there's only one GameIndexPage
  } catch (error) {
    console.error('Error fetching game index SEO:', error);
    throw error;
  }
};

export const fetchProductIndexSEO = async () => {
  try {
    const response = await axios.get(`${API_URL}/productindex/`);
    return response.data[0];  // Assuming there's only one ProductIndexPage
  } catch (error) {
    console.error('Error fetching product index SEO:', error);
    throw error;
  }
};

export const fetchHomePageSEO = async () => {
  try {
    const response = await axios.get(`${API_URL}/homepage/`);
    return response.data[0];  // Assuming there's only one HomePage
  } catch (error) {
    console.error('Error fetching home page SEO:', error);
    throw error;
  }
};
