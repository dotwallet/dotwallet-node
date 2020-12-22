import { IAppAccessTokenData } from './types';
export declare const getAppAccessToken: (CLIENT_ID: string, SECRET: string, DotWalletClass: any, log: boolean) => Promise<IAppAccessTokenData | undefined>;
