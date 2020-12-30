// import axios from 'axios';
// import { IAutoPaymentOrder, IOrderResponseData } from './types';
// export const autopayment = (SECRET: string) => {
//   return async (orderData: IAutoPaymentOrder, log?: boolean): Promise<IOrderResponseData | Error | undefined> => {
//     try {
//       let returnData: IOrderResponseData;

//       // could add check here if recieve address is dev's own
//       if (log) console.log('==============orderData==============\n', orderData);
//       const orderWithSecret = {
//         ...orderData,
//         secret: SECRET,
//       };
//       if (log) console.log('==============posting order==============\n', orderWithSecret);
//       const orderResponse = await axios.post('https://www.ddpurse.com/openapi/pay_small_money', orderWithSecret);
//       const orderResponseData = orderResponse.data;
//       if (log) console.log('==============orderResponseData==============', orderResponseData);
//       if (
//         // balance or limit too low
//         orderResponseData.code === -101001 ||
//         orderResponseData.code === -10039 ||
//         orderResponseData.code === -10044
//       ) {
//         returnData = { error: orderResponseData.msg || orderResponseData.data || orderResponseData };
//         return returnData;
//       } else if (orderResponseData.code !== 0) throw orderResponse;
//       if (orderResponseData.data) {
//         returnData = orderResponseData.data;
//         return returnData;
//       } else {
//         throw orderResponseData;
//       }
//     } catch (err) {
//       if (log) console.log('==============err==============\n', err);
//       return err;
//     }
//   };
// };
