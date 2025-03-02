import axios from 'axios';

const PANDASCORE_API_KEY = process.env.NEXT_PUBLIC_ESPORTS_API_KEY;
const PANDASCORE_API_URL = 'https://api.pandascore.co';

export const fetchEsportsSEO = async () => {
  // Your existing SEO fetching logic
};

export const fetchLiveEsportsMatches = async () => {
  const response = await axios.get(`${PANDASCORE_API_URL}/matches/running`, {
    headers: {
      'Authorization': `Bearer ${PANDASCORE_API_KEY}`,
    },
  });
  return response.data;
};

export const fetchRecentEsportsResults = async () => {
  const response = await axios.get(`${PANDASCORE_API_URL}/matches/past`, {
    headers: {
      'Authorization': `Bearer ${PANDASCORE_API_KEY}`,
    },
  });
  return response.data;
};

export const fetchEsportsArticles = async () => {
  // Your existing articles fetching logic
};