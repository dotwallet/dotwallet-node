import { dataType, IGetHostedResponse, IGetBalanceResponse, ISaveDataResponse } from './types';
export declare const saveData: (CLIENT_ID: string, SECRET: string) => (data: any, dataType?: dataType, log?: boolean | undefined) => Promise<ISaveDataResponse | Error | undefined>;
export declare const getHostedAccount: (CLIENT_ID: string, SECRET: string) => (coinType?: string, log?: boolean | undefined) => Promise<IGetHostedResponse | Error | undefined>;
export declare const hostedAccountBalance: (CLIENT_ID: string, SECRET: string) => (coinType?: string, log?: boolean | undefined) => Promise<IGetBalanceResponse | Error | undefined>;
