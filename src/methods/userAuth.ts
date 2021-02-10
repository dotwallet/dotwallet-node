import axios, { AxiosRequestConfig } from 'axios';
import { IUserAccessTokenData, IUserData } from '../types';
import { DOTWALLET_API } from '../config';
import DotWallet from '../index';
export const getUserToken = ($this: DotWallet) => {
  return async (code: string, redirectUri: string, log: boolean = false) => {
    try {
      if (log) console.log('==============getUserToken code==============\n', code);
      if (!code) throw Error('no code supplied. Supply one in the request body {code: <the_code>}');
      const data = {
        client_id: $this.getClientID(),
        client_secret: $this.getSecret(),
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      };
      console.log(data);
      const accessTokenRequest = await axios.post(`${DOTWALLET_API}/oauth2/get_access_token`, data);
      if (log) console.log('==============getUserToken result==============\n', accessTokenRequest.data);
      if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
      else {
        const result: IUserAccessTokenData = {
          ...accessTokenRequest.data.data,
        };
        return result;
      }
    } catch (error) {
      if (log) console.log('==============getUserToken ERROR==============\n', error);
      return { error };
    }
  };
};

// call refresh token if token is expired? same in autopay?
export const getUserInfo = async (userAccessToken: string, log: boolean = false) => {
  try {
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${userAccessToken}`,
      },
      method: 'POST',
    };
    const userInfoRequest = await axios(`${DOTWALLET_API}/user/get_user_info`, options);
    if (log) console.log('==============getUserInfo result==============\n', userInfoRequest.data);
    return userInfoRequest.data.data as IUserData;
  } catch (error) {
    if (log) console.log('==============getUserInfo ERROR==============\n', error);
    return { error };
  }
};

export const refreshUserToken = ($this: DotWallet) => {
  return async (refreshToken: string, log: boolean = false) => {
    try {
      const data = {
        client_id: $this.getClientID(),
        client_secret: $this.getSecret(),
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      };
      const accessTokenRequest = await axios.post(`${DOTWALLET_API}/oauth2/get_access_token`, data);
      if (log) console.log('==============refresh access token result==============\n', accessTokenRequest.data);

      if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
      else {
        const result: IUserAccessTokenData = {
          ...accessTokenRequest.data.data,
        };
        return result;
      }
    } catch (error) {
      if (log) console.log('==============refreshUserToken ERROR==============\n', error);
      return { error };
    }
  };
};
