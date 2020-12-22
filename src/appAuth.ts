import axios from 'axios';
import { IAppAccessTokenData } from './types';

export const getAppAccessToken = async (
  CLIENT_ID: string,
  SECRET: string,
  DotWalletClass: any,
  log: boolean,
): Promise<IAppAccessTokenData | undefined> => {
  try {
    const data = {
      client_id: CLIENT_ID,
      client_secret: SECRET,
      grant_type: 'client_credentials',
    };

    const accessTokenRequest = await axios.post('https://api.ddpurse.com/v1/oauth2/get_access_token', data);
    if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
    if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
    else {
      DotWalletClass.appAccessToken = accessTokenRequest.data.data.access_token;
      return accessTokenRequest.data.data;
    }
  } catch (error) {
    console.log('==============ERROR==============\n', error);
  }
};
