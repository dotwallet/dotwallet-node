import axios from 'axios';
import { IAppAccessTokenData } from './types';

export const getAppAccessToken = async (
  CLIENT_ID: string,
  SECRET: string,
): Promise<IAppAccessTokenData | undefined> => {
  try {
    const data = {
      client_id: CLIENT_ID,
      client_secret: SECRET,
      grant_type: 'client_credentials',
    };
    const accessTokenRequest = await axios.post('https://api.ddpurse.com/v1/oauth2/get_access_token', data);
    console.log('==============access token result==============\n', accessTokenRequest.data);
    if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
    else return accessTokenRequest.data.data;
  } catch (error) {
    console.log('==============ERROR==============\n', error);
  }
};
