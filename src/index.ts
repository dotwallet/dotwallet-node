// import { Request, Response, NextFunction } from 'express';
import { getUserToken, getUserInfo, refreshUserToken } from './userAuth';
import { getOrderID, getOrderStatus } from './order';
import {
  IUserData,
  IUserAccessTokenData,
  IPaymentOrder,
  // IOrderData,
  // IOrderStatusInfo,
  // IOrderResponseData,
  // IAutoPaymentOrder,
  // dataType,
  // IGetHostedResponse,
  // IGetBalanceResponse,
  // ISaveDataResponse,
} from './types';
// import { autopayment } from './autopayment';
// import { saveData, getHostedAccount, hostedAccountBalance } from './saveData';
import { getAppAccessToken } from './appAuth';
class DotWallet {
  CLIENT_ID: string = '';
  SECRET: string = '';
  appAccessToken: string = '';

  // refreshAppAuth = async () => {};
  // populateStaticMethods = () => {
  //   this.getUserToken = getUserToken(this.CLIENT_ID, this.SECRET);
  //   this.paymentOrder = paymentOrder(this.CLIENT_ID, this.SECRET);
  //   this.getOrderStatus = getOrderStatus(this.CLIENT_ID, this.SECRET);
  //   this.autopayment = autopayment(this.SECRET);
  //   this.getHostedAccount = getHostedAccount(this.CLIENT_ID, this.SECRET);
  //   this.hostedAccountBalance = hostedAccountBalance(this.CLIENT_ID, this.SECRET);
  //   this.saveData = saveData(this.CLIENT_ID, this.SECRET);
  // };
  // populateTokenMethods = () => {
  //   // when they return an expired token error, recursive call up to 2 times.
  // };

  init = async (CLIENT_ID: string, SECRET: string, log: boolean = false) => {
    this.CLIENT_ID = CLIENT_ID;
    this.SECRET = SECRET;
    await getAppAccessToken(this, log);

    // the app access token will expire every 2 hours.
    setInterval(async () => {
      getAppAccessToken(this, log);
    }, 7200000);
    // this.refreshAccess = refreshAccess(this.CLIENT_ID, this);
  };

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
  getUserToken = getUserToken(this);

  getUserInfo = getUserInfo;

  /**
   * @summary sign an order with your developer key, and send it to dotwallet servers to get an order_sn
   * @param { IOrderData } orderData a valid order as a js object (see the docs or this IorderData type)
   * @returns { string } the order_sn
   */
  getOrderID = getOrderID(this);

  getOrderStatus = getOrderStatus(this);

  // getOrderStatus: (merchant_order_sn: string) => Promise<IOrderStatusInfo | Error | undefined> = getOrderStatus(
  //   this.CLIENT_ID,
  //   this.SECRET,
  // );

  // /**
  //  * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
  //  * @param { IAutoPaymentOrder } orderData a valid order as a js object (see the docs or this IAutoPaymentOrder type)
  //  * @returns { IOrderResponseData } The order
  //  */
  // autopayment: (
  //   orderData: IAutoPaymentOrder,
  //   log?: boolean | undefined,
  // ) => Promise<IOrderResponseData | Error | undefined> = autopayment(this.SECRET);

  // getHostedAccount: (
  //   coinType?: string,
  //   log?: boolean | undefined,
  // ) => Promise<IGetHostedResponse | Error | undefined> = getHostedAccount(this.CLIENT_ID, this.SECRET);

  // hostedAccountBalance: (
  //   coinType?: string,
  //   log?: boolean | undefined,
  // ) => Promise<IGetBalanceResponse | Error | undefined> = hostedAccountBalance(this.CLIENT_ID, this.SECRET);

  // /**
  //  * @param {dataType} dataType 0 for string and 1 for rawhex. If you select 0 (the default) we will JSON.stringify() the data to be saved on chain
  //  * @param {string|object} data JSON.stringify-able data if default, or rawhex string if rawhex
  //  */
  // saveData: (
  //   data: any,
  //   dataType?: dataType,
  //   log?: boolean | undefined,
  // ) => Promise<ISaveDataResponse | Error | undefined> = saveData(this.CLIENT_ID, this.SECRET);
}

export = DotWallet;
