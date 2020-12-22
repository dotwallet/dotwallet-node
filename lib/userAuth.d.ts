import { IUserAccessTokenData, IUserData } from './types';
export declare const getUserToken: (CLIENT_ID: string, SECRET: string) => (code: string, redirectUri: string, log?: false | undefined) => Promise<IUserAccessTokenData | undefined>;
export declare const getUserInfo: (userAccessToken: string, log?: false | undefined) => Promise<IUserData | undefined>;
export declare const refreshUserToken: (CLIENT_ID: string, SECRET: string) => (refreshToken: string, log?: false | undefined) => Promise<IUserAccessTokenData | undefined>;
