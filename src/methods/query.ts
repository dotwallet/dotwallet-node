import axios, { AxiosRequestConfig } from 'axios';
import { ITXInquiry } from '../types';
import DotWallet from '../index';
import { DOTWALLET_API } from '../config';
import { requestAppAccessToken } from './appAuth';

export const queryTx = ($this: DotWallet) => {
  return async (txid: string, log: boolean = false) => {
    try {
      if (log) console.log('==============queryTx txid==============\n', txid);
      const options: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$this.getAppAccessToken()}`,
        },
        method: 'POST',
        data: JSON.stringify({ transaction_hash: txid }),
      };
      const callApi = () => axios(`${DOTWALLET_API}/bsvchain/get_transaction`, options);
      let response = await callApi();
      let responseData = response.data;
      if (log) console.log('==============queryTransaction responseData==============', responseData);
      if (responseData.code === 75000) {
        await requestAppAccessToken($this, log);
        response = await callApi();
        responseData = response.data;
      } else if (responseData.code !== 0) {
        return { error: response };
      }
      const txInquiry: ITXInquiry = responseData.data;
      return txInquiry;
    } catch (error) {
      if (log) console.log('==============query transaction error==============\n', error);
      return { error };
    }
  };
};
