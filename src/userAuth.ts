import axios, { AxiosRequestConfig } from 'axios';
import { IUserAccessTokenData, IUserData } from './types';
import { DOTWALLET_API } from './config';
import DotWallet from './index';
export const getUserToken = ($this: DotWallet) => {
  return async (code: string, redirectUri: string, log?: false) => {
    try {
      if (log) console.log('==============got code==============\n', code);
      if (!code) throw Error('no code supplied. Supply one in the request body {code: <the_code>}');
      const data = {
        client_id: $this.CLIENT_ID,
        client_secret: $this.SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      };
      console.log(data);
      const accessTokenRequest = await axios.post(`${DOTWALLET_API}/oauth2/get_access_token`, data);
      if (log) console.log('==============access token result==============\n', accessTokenRequest.data);
      if (!accessTokenRequest.data.data.access_token || accessTokenRequest.data.code !== 0) throw accessTokenRequest;
      else {
        const result: IUserAccessTokenData = {
          ...accessTokenRequest.data.data,
        };
        return result;
      }
    } catch (err) {
      if (log) console.log('==============ERROR==============\n', err);
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
    console.log('############################### user_access token', userAccessToken);
    console.log('############################### options', options);

    const userInfoRequest = await axios(`${DOTWALLET_API}/user/get_user_info`, options);
    if (log) console.log('==============user info result==============\n', userInfoRequest);
    return userInfoRequest.data.data as IUserData;
  } catch (err) {
    if (log) console.log('==============ERROR==============\n', err);
  }
};

export const refreshUserToken = ($this: DotWallet) => {
  return async (refreshToken: string, log: boolean = false) => {
    try {
      const data = {
        client_id: $this.CLIENT_ID,
        client_secret: $this.SECRET,
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
      if (log) console.log('==============ERROR==============\n', error);
    }
  };
};
