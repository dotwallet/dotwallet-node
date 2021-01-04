import axios, { AxiosRequestConfig } from 'axios';
import DotWallet from './index';
import { IAutoPayOrder, IAutoPayResponse } from './types';
import { DOTWALLET_API } from './config';
import { requestAppAccessToken } from './appAuth';

export const autoPay = ($this: DotWallet) => {
  return async (order: IAutoPayOrder, log: boolean = false) => {
    try {
      // console.log('==============orderData==============\n', req.body);
      const options: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$this.getAppAccessToken()}`,
        },
        method: 'POST',
        data: order,
      };
      const callApi = () => axios(`${DOTWALLET_API}/transact/order/autopay`, options);
      let orderResponse = await callApi();
      let orderResponseData = orderResponse.data;
      if (log) console.log('==============orderResponseData==============', orderResponseData);
      if (orderResponseData.code === 75000) {
        // if token expired
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
      console.log('==============autoPay error==============\n', error);
      return { error };
    }
  };
};
