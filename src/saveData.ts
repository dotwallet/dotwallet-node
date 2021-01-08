import axios, { AxiosRequestConfig } from 'axios';
import { IAutoPayResponse, IAutoPayOrder, ITXInquiry } from './types';
import { v4 as uuid } from 'uuid';
import DotWallet from './index';
import { DOTWALLET_API } from './config';
import { requestAppAccessToken } from './appAuth';

export const saveData = ($this: DotWallet) => {
  return async (
    data: any,
    userID: string,
    options?: {
      out_order_id?: string;
      product?: {
        id?: string;
        name?: string;
        detail?: string;
      };
      subject?: string;
      notify_url?: string;
      redirect_uri?: string;
    },
    log: boolean = false,
  ) => {
    try {
      const hexEncoded = Buffer.from(JSON.stringify(data), 'utf8').toString('hex');
      if (log)
        console.log('==============saveData received: data, userID, options==============\n', data, userID, options);
      const orderData: IAutoPayOrder = {
        user_id: userID,
        out_order_id: options?.out_order_id || uuid(),
        coin_type: 'BSV',
        to: [
          {
            type: 'script',
            content: `006a${hexEncoded}`,
            amount: 0,
          },
        ],
        product: {
          id: options?.product?.id || uuid(),
          name: options?.product?.name || new Date().getDate().toString(),
          detail: options?.product?.detail,
        },
        subject: options?.subject,
        notify_url: options?.notify_url,
      };
      const requestOptions: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$this.getAppAccessToken()}`,
        },
        method: 'POST',
        data: orderData,
      };
      const callApi = () => axios(`${DOTWALLET_API}/transact/order/autopay`, requestOptions);
      let orderResponse = await callApi();
      let orderResponseData = orderResponse.data;
      if (log) console.log('==============saveData orderResponseData==============', orderResponseData);
      if (orderResponseData.code === 75000) {
        await requestAppAccessToken($this, log);
        orderResponse = await callApi();
        orderResponseData = orderResponse.data;
      }
      if (
        orderResponseData.code === 10180007 || // autopay wallet balance too low
        orderResponseData.code === 10180029 // autopay transaction limit too low
      ) {
        return { error: 'balance too low' };
      } else if (orderResponseData.code !== 0) throw orderResponseData;
      else return orderResponseData.data as IAutoPayResponse;
    } catch (error) {
      if (log) console.log('==============save data error==============\n', error);
      return { error };
    }
  };
};

export const getSavedData = ($this: DotWallet) => {
  return async (txid: string, log: boolean = false) => {
    try {
      if (log) console.log('==============getSavedData txid==============\n', txid);
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
      if (log) console.log('==============getSavedData responseData==============', responseData);
      if (responseData.code === 75000) {
        await requestAppAccessToken($this, log);
        response = await callApi();
        responseData = response.data;
      }
      let data: any;
      const txInquiry: ITXInquiry = responseData.data;
      txInquiry.vouts.forEach((vout) => {
        if (vout.script_hex.startsWith('006a')) {
          const hexDecoded = Buffer.from(
            vout.script_hex.slice(4), // slice off the '006a'
            'hex',
          ).toString('utf8');
          data = JSON.parse(hexDecoded);
        }
      });
      return data;
    } catch (error) {
      if (log) console.log('==============getSavedData error==============\n', error);
      return { error };
    }
  };
};
