// src/services/api.tsx
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
