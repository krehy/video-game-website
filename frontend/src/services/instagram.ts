// services/instagram.ts
import axios from 'axios';

export const fetchInstagramPhotos = async () => {
  try {
    const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram photos:', error);
    return [];
  }
};
