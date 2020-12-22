import { IOrderData, IOrderStatusInfo } from './types';
export declare const handleOrder: (CLIENT_ID: string, SECRET: string) => (orderData: IOrderData, log?: boolean | undefined) => Promise<string | Error | undefined>;
export declare const getOrderStatus: (CLIENT_ID: string, SECRET: string, log?: boolean | undefined) => (merchant_order_sn: string) => Promise<IOrderStatusInfo | Error | undefined>;
