import axios, { AxiosRequestConfig } from 'axios';
import { IPaymentOrder, IPaymentQuery } from '../types';
import { DOTWALLET_API } from '../config';
import DotWallet from '../index';
import { requestAppAccessToken } from './appAuth';

async function createOrder(orderData: IPaymentOrder, appAccessToken: string, log: boolean = false) {
  try {
    if (log) console.log('==============createOrder orderData==============\n', orderData);
    // console.log('==============appAccessToken==============\n', appAccessToken);
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appAccessToken}`,
      },
      method: 'POST',
      data: { ...orderData },
    };
    const orderIDResponse = await axios(`${DOTWALLET_API}/transact/order/create`, options);
    const orderIDData = orderIDResponse.data;
    if (log) console.log('==============createOrder orderIDData==============', orderIDData);
    if (orderIDData.code === 75000) return { error: 'expired token' };
    else if (orderIDData.data && orderIDData.code == 0 && orderIDData.data) {
      return { orderID: orderIDData.data as string };
    } else {
      throw orderIDData;
    }
  } catch (error) {
    if (log) console.log('==============createOrder error==============\n', error);
    return { error };
  }
}

export const getOrderID = ($this: DotWallet) => {
  return async (order: IPaymentOrder, log: boolean = false) => {
    try {
      let orderIdResult = await createOrder(order, $this.getAppAccessToken(), log);
      if (orderIdResult.error === 'expired token') {
        await requestAppAccessToken($this, log);
        orderIdResult = await createOrder(order, $this.getAppAccessToken(), log);
      }
      if (orderIdResult.error) throw orderIdResult.error;

      if (log) console.log('==============orderIdResult==============\n', orderIdResult);
      return orderIdResult.orderID as string;
    } catch (error) {
      if (log) console.log('==============getOrderID error==============\n', error);
      return { error };
    }
  };
};

const orderStatus = async (orderID: string, appAccessToken: string, log: boolean = false) => {
  try {
    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appAccessToken}`,
      },
      method: 'POST',
      data: { order_id: orderID },
    };
    const orderStatusResponse = await axios(`${DOTWALLET_API}/transact/order/get_order`, options);
    if (!orderStatusResponse.data || orderStatusResponse.data.code !== 0) throw orderStatusResponse;
    if (orderStatusResponse.data.code === 75000) return { error: 'expired token' };
    const orderStatusData: IPaymentQuery = orderStatusResponse.data.data;
    if (log) console.log('==============order Status result==============\n', orderStatusData);
    return { orderStatusData };
  } catch (error) {
    if (log) console.log('==============orderStatus error==============\n', error);
    return { error };
  }
};

export const getOrderStatus = ($this: DotWallet) => {
  return async (orderID: string, log: boolean = false) => {
    try {
      let orderStatusResult = await orderStatus(orderID, $this.getAppAccessToken(), log);
      if (orderStatusResult?.error === 'expired token') {
        await requestAppAccessToken($this, log);
        orderStatusResult = await orderStatus(orderID, $this.getAppAccessToken(), log);
      }
      // if (log) console.log('==============orderStatusResult==============\n', orderStatusResult);
      if (orderStatusResult?.error) throw orderStatusResult.error;
      else return orderStatusResult?.orderStatusData as IPaymentQuery;
    } catch (error) {
      if (log) console.log('==============error==============\n', error);
      return { error };
    }
  };
};
