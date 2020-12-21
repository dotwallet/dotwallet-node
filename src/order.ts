import axios from 'axios';
import * as crypto from 'crypto';
import * as md5 from 'md5';
import { IOrderData, IOrderStatusInfo } from './types';
function getSignature(orderData: any, appSecret: string) {
  let str = '';
  const secret = md5(appSecret);

  for (let key in orderData) {
    if (key !== 'sign' && key !== 'opreturn') {
      if (str) {
        str += '&' + key + '=' + orderData[key];
      } else {
        str = key + '=' + orderData[key];
      }
    }
  }

  str += '&secret=' + secret;
  str = str.toUpperCase();

  const sign = crypto.createHmac('sha256', secret).update(str, 'utf8').digest('hex');

  return sign;
}

export const handleOrder = (CLIENT_ID: string, SECRET: string) => {
  return async (orderData: IOrderData, log?: boolean): Promise<string | Error | undefined> => {
    try {
      if (orderData.app_id !== CLIENT_ID) throw 'order app_id does not match server app_id';
      if (log) console.log('==============orderData==============\n', orderData);
      const signedOrder = {
        ...orderData,
        sign: getSignature(orderData, SECRET),
      };
      if (log) console.log('==============posting signed order==============\n', signedOrder);

      const orderSnResponse = await axios.post('https://www.ddpurse.com/platform/openapi/create_order', signedOrder);
      const orderSnData = orderSnResponse.data;
      if (orderSnData.data && orderSnData.data.order_sn && orderSnData.code === 0) {
        if (log) console.log('==============orderSnData==============', orderSnData);
        return orderSnData.data.order_sn;
      } else throw orderSnResponse;
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
    }
  };
};

export const getOrderStatus = (CLIENT_ID: string, SECRET: string, log?: boolean) => {
  return async (merchant_order_sn: string): Promise<IOrderStatusInfo | Error | undefined> => {
    try {
      const orderStatusResponse = await axios.post('https://www.ddpurse.com/platform/openapi/search_order', {
        app_id: CLIENT_ID,
        secret: SECRET,
        merchant_order_sn: merchant_order_sn,
      });
      if (!orderStatusResponse.data) throw orderStatusResponse;
      const orderStatusData = orderStatusResponse.data;
      if (log) console.log('==============orderStatus==============\n', orderStatusData);
      if (!orderStatusData.data || orderStatusData.code !== 0) throw orderStatusData;
      const returnData: IOrderStatusInfo = orderStatusData.data;
      return returnData;
    } catch (err) {
      if (log) console.log('==============err==============\n', err);
      return err;
    }
  };
};
