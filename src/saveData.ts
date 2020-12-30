// import axios, { AxiosRequestConfig } from 'axios';
// import { dataType, IGetHostedResponse, IGetBalanceResponse, ISaveDataResponse } from './types';

// export const saveData = (CLIENT_ID: string, SECRET: string) => {
//   return async (data: any, dataType: dataType = 0, log?: boolean): Promise<ISaveDataResponse | Error | undefined> => {
//     try {
//       const saveDataOptions: AxiosRequestConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           appid: CLIENT_ID,
//           appsecret: SECRET,
//         },
//         method: 'POST',
//         data: {
//           coin_type: 'BSV',
//           data: dataType === 0 ? JSON.stringify(data) : data,
//           data_type: dataType,
//         },
//       };
//       const res = await axios('https://www.ddpurse.com/platform/openapi/v2/push_chain_data', saveDataOptions);
//       const saveDataResponse = res.data;
//       if (log) console.log('==============saveDataResponse==============', saveDataResponse);
//       if (saveDataResponse.code !== 0) throw saveDataResponse;
//       const returnData: ISaveDataResponse = saveDataResponse.data;
//       return returnData;
//     } catch (err) {
//       if (log) console.log('==============err==============\n', err);
//       return err;
//     }
//   };
// };

// export const getHostedAccount = (CLIENT_ID: string, SECRET: string) => {
//   return async (coinType: string = 'BSV', log?: boolean): Promise<IGetHostedResponse | Error | undefined> => {
//     try {
//       const getHostedOptions: AxiosRequestConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           appid: CLIENT_ID,
//           appsecret: SECRET,
//         },
//         method: 'POST',
//         data: {
//           coin_type: coinType,
//         },
//       };
//       const res = await axios('https://www.ddpurse.com/platform/openapi/v2/get_hosted_account', getHostedOptions);
//       const getHostedData = res.data;
//       if (log) console.log('==============getHostedData==============', getHostedData);
//       if (getHostedData.code !== 0 || !getHostedData.data.address) throw getHostedData;
//       const returnData: IGetHostedResponse = getHostedData.data;
//       return returnData;
//     } catch (err) {
//       if (log) console.log('==============err==============\n', err);
//       return err;
//     }
//   };
// };

// export const hostedAccountBalance = (CLIENT_ID: string, SECRET: string) => {
//   return async (coinType: string = 'BSV', log?: boolean): Promise<IGetBalanceResponse | Error | undefined> => {
//     try {
//       const getBalanceOptions: AxiosRequestConfig = {
//         headers: {
//           'Content-Type': 'application/json',
//           appid: CLIENT_ID,
//           appsecret: SECRET,
//         },
//         method: 'POST',
//         data: {
//           coin_type: coinType,
//         },
//       };
//       const getBalance = await axios(
//         'https://www.ddpurse.com/platform/openapi/v2/get_hosted_account_balance',
//         getBalanceOptions,
//       );
//       const getBalanceData = getBalance.data;
//       if (log) console.log('==============getBalanceData==============', getBalanceData);
//       if (getBalanceData.code !== 0 || !getBalanceData.data) throw getBalanceData;
//       const returnData: IGetBalanceResponse = getBalanceData.data;
//       return returnData;
//     } catch (err) {
//       if (log) console.log('==============err==============\n', err);
//       return err;
//     }
//   };
// };
