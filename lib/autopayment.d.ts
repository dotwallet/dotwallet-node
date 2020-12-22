import { IAutoPaymentOrder, IOrderResponseData } from './types';
export declare const autopayment: (SECRET: string) => (orderData: IAutoPaymentOrder, log?: boolean | undefined) => Promise<IOrderResponseData | Error | undefined>;
