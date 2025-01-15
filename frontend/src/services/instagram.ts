// services/instagram.ts
import axios from 'axios';

export const fetchInstagramPhotos = async () => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
    );

    const items = response.data.data;

    // Separate photos and reels, sort by timestamp, and limit results
    const photos = items
      .filter((item: any) => item.media_type === 'IMAGE')
      .slice(0, 10); // Limit to 10 photos

    const reels = items
      .filter((item: any) => item.media_type === 'VIDEO')
      .slice(0, 6); // Limit to 6 reels

    return { photos, reels };
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return { photos: [], reels: [] };
  }
};
