import axios, { AxiosRequestConfig } from 'axios';
import { IPaymentOrder, IPaymentQuery } from './types';
import { DOTWALLET_API } from './config';
import DotWallet from './index';
import { getAppAccessToken } from './appAuth';

async function createOrder(orderData: IPaymentOrder, appAccessToken: string, log: boolean = false) {
  try {
    console.log('==============orderData==============\n', orderData);
    console.log('==============appAccessToken==============\n', appAccessToken);

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
    if (log) console.log('==============orderIDData==============', orderIDData);
    if (orderIDData.code === 75000) return 'expired token';
    else if (orderIDData.data && orderIDData.code == 0 && orderIDData.data) {
      return orderIDData.data;
    } else {
      return { error: orderIDData.data ? orderIDData.data : orderIDData };
    }
  } catch (err) {
    if (log) console.log('==============err==============\n', err);
  }
}

export const getOrderID = ($this: DotWallet) => {
  return async (order: IPaymentOrder, log: boolean = false): Promise<string | Error | undefined> => {
    try {
      let orderIdResult = await createOrder(order, $this.appAccessToken, log);
      if (orderIdResult === 'expired token') {
        await getAppAccessToken($this, log);
        orderIdResult = await createOrder(order, $this.appAccessToken, log);
      }
      if (log) console.log('==============orderIdResult==============\n', orderIdResult);
      return orderIdResult;
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
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
    if (orderStatusResponse.data.code === 75000) return 'expired token';
    const orderStatusData: IPaymentQuery = orderStatusResponse.data;
    if (log) console.log('==============order Status result==============\n', orderStatusData);
    return orderStatusData;
  } catch (err) {
    if (log) console.log('==============err==============\n', err);
  }
};

export const getOrderStatus = ($this: DotWallet) => {
  return async (orderID: string, log: boolean = false) => {
    try {
      let orderStatusResult = await orderStatus(orderID, $this.appAccessToken, log);
      if (orderStatusResult === 'expired token') {
        await getAppAccessToken($this, log);
        orderStatusResult = await orderStatus(orderID, $this.appAccessToken, log);
      }
      if (log) console.log('==============orderStatusResult==============\n', orderStatusResult);
      return orderStatusResult;
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
    }
  };
};
