import { IUserData, IUserAccessTokenData, IOrderData, IOrderStatusInfo, IOrderResponseData, IAutoPaymentOrder, dataType, IGetHostedResponse, IGetBalanceResponse, ISaveDataResponse } from './types';
declare class DotWallet {
    private CLIENT_ID;
    private SECRET;
    private appAccessToken;
    refreshAppAuth: () => Promise<void>;
    populateStaticMethods: () => void;
    populateTokenMethods: () => void;
    resetAppToken: (CLIENT_ID: string, SECRET: string, that: this) => Promise<void>;
    init: (CLIENT_ID: string, SECRET: string) => Promise<void>;
    /**
     * @param code the code from the login challenge at https://api.ddpurse.com/v1/oauth2/authorize?client_id=...
     * @param redirectUri Must match provided redirect uri in the login challenge
     * @param log whether to log events
     * @example
    app.post('/auth', async (req, res, next) => {
      const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
      res.json({ ...authTokenData });
    });
     * @returns {object} { access_token: 'JWT access token', expires_in: number, token_type: 'Bearer', refresh_token: string, scope: string
  }
     */
    getUserToken: (code: string, redirectUri: string, log?: false | undefined) => Promise<IUserAccessTokenData | undefined>;
    getUserInfo: (userAccessToken: string, log?: false | undefined) => Promise<IUserData | undefined>;
    /**
     * @summary sign an order with your developer key, and send it to dotwallet servers to get an order_sn
     * @param { IOrderData } orderData a valid order as a js object (see the docs or this IorderData type)
     * @returns { string } the order_sn
     */
    handleOrder: (orderData: IOrderData, log?: boolean | undefined) => Promise<string | Error | undefined>;
    getOrderStatus: (merchant_order_sn: string) => Promise<IOrderStatusInfo | Error | undefined>;
    /**
     * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
     * @param { IAutoPaymentOrder } orderData a valid order as a js object (see the docs or this IAutoPaymentOrder type)
     * @returns { IOrderResponseData } The order
     */
    autopayment: (orderData: IAutoPaymentOrder, log?: boolean | undefined) => Promise<IOrderResponseData | Error | undefined>;
    getHostedAccount: (coinType?: string, log?: boolean | undefined) => Promise<IGetHostedResponse | Error | undefined>;
    hostedAccountBalance: (coinType?: string, log?: boolean | undefined) => Promise<IGetBalanceResponse | Error | undefined>;
    /**
     * @param {dataType} dataType 0 for string and 1 for rawhex. If you select 0 (the default) we will JSON.stringify() the data to be saved on chain
     * @param {string|object} data JSON.stringify-able data if default, or rawhex string if rawhex
     */
    saveData: (data: any, dataType?: dataType, log?: boolean | undefined) => Promise<ISaveDataResponse | Error | undefined>;
}
export = DotWallet;
