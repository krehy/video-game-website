import axios from 'axios';

const TWITCH_CLIENT_ID = 'i2ypuotqkah4zj6j6osmkfz76yrqc2';
const TWITCH_CLIENT_SECRET = 'kxp1ys44b18odaxlihkvlvgu66zp6h';
const TWITCH_USERNAME = 'superparmeni';

let accessToken = 'ngc3xz5wfxdxexywzmvk6ahk38r7ch';

// Function to fetch a new access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });
    accessToken = response.data.access_token;
    console.log('New access token fetched:', accessToken);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error getting access token:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error getting access token:', error.message);
    } else {
      console.error('Unknown error occurred while getting access token.');
    }
    console.error('Client ID:', TWITCH_CLIENT_ID);
    console.error('Client Secret:', TWITCH_CLIENT_SECRET ? '***hidden***' : 'Not provided');
    throw new Error('Failed to fetch Twitch access token');
  }
};

// Function to check if the user is live
const isUserLive = async () => {
  try {
    // Ensure we have a valid access token
    if (!accessToken) {
      await getAccessToken();
    }

    // Get user ID from username
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        login: TWITCH_USERNAME,
      },
    });

    const userId = userResponse.data.data[0]?.id;
    if (!userId) {
      console.error('User not found on Twitch:', TWITCH_USERNAME);
      return null;
    }

    // Check if the user is live
    const streamResponse = await axios.get('https://api.twitch.tv/helix/streams', {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user_id: userId,
      },
    });

    return streamResponse.data.data.length > 0 ? streamResponse.data.data[0] : null;
  } catch (error: unknown) {
    // Handle 401 errors by refreshing the token
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.warn('Access token expired. Fetching a new one.');
        await getAccessToken();
        return await isUserLive(); // Retry the request after refreshing the token
      }
      console.error('Error checking live status:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error checking live status:', error.message);
    } else {
      console.error('Unknown error occurred while checking live status.');
    }
    return null;
  }
};

export { isUserLive };
