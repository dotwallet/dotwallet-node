import axios, { AxiosRequestConfig } from 'axios';
import { IUserAccessTokenData, IUserData } from './types';
import { DOTWALLET_API } from './config';

export const getUserToken = (CLIENT_ID: string, SECRET: string) => {
  return async (code: string, redirectUri: string, log?: false) => {
    try {
      if (log) console.log('==============got code==============\n', code);
      if (!code) throw Error('no code supplied. Supply one in the request body {code: <the_code>}');
      const data = {
        client_id: CLIENT_ID,
        client_secret: SECRET,
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
export const getUserInfo = async (userAccessToken: string, log?: false) => {
  try {
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAccessToken}`,
      },
      method: 'POST',
    };
    const userInfoRequest = await axios(`${DOTWALLET_API}/user/get_user_info`, options);
    if (log) console.log('==============user info result==============\n', userInfoRequest.data);
    return userInfoRequest.data.data as IUserData;
  } catch (err) {
    if (log) console.log('==============ERROR==============\n', err);
  }
};

export const refreshUserToken = (CLIENT_ID: string, SECRET: string) => {
  return async (refreshToken: string, log?: false) => {
    try {
      const data = {
        client_id: CLIENT_ID,
        client_secret: SECRET,
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
