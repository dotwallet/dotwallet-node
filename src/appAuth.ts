import axios from 'axios';
import { IAppAccessTokenData } from './types';
import DotWallet from './index';
export const getAppAccessToken = async (
  $this: DotWallet,
  log: boolean = false,
): Promise<IAppAccessTokenData | undefined> => {
  try {
    const data = {
      client_id: $this.CLIENT_ID,
      client_secret: $this.SECRET,
      grant_type: 'client_credentials',
    };
    const accessTokenRequest = await axios.post('https://api.ddpurse.com/v1/oauth2/get_access_token', data);
    if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
    if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
    else {
      $this.appAccessToken = accessTokenRequest.data.data.access_token;
      return accessTokenRequest.data.data;
    }
  } catch (error) {
    if (log) console.log('==============ERROR==============\n', error);
  }
};
