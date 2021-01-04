import axios from 'axios';
import { IAppAccessTokenData } from './types';
import DotWallet from './index';
export const requestAppAccessToken = async ($this: DotWallet, log: boolean = false) => {
  try {
    const data = {
      client_id: $this.getClientID(),
      client_secret: $this.getSecret(),
      grant_type: 'client_credentials',
    };
    const accessTokenRequest = await axios.post('https://api.ddpurse.com/v1/oauth2/get_access_token', data);
    if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
    if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
    const tokenRequestData: IAppAccessTokenData = accessTokenRequest.data.data;
    $this.setAppAccessToken(tokenRequestData.access_token);
    return tokenRequestData;
  } catch (error) {
    if (log) console.log('==============requestAppAccessToken ERROR==============\n', error);
    return { error };
  }
};
