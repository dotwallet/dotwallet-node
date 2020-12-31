// import { Request, Response, NextFunction } from 'express';
import { getUserToken, getUserInfo, refreshUserToken } from './userAuth';
import { getOrderID, getOrderStatus } from './order';
import { IUserData, IUserAccessTokenData, IPaymentOrder, IAutoPayOrder } from './types';
import { autoPay } from './autopay';
// import { saveData, getHostedAccount, hostedAccountBalance } from './saveData';
import { requestAppAccessToken } from './appAuth';
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
  getSecret = () => this.SECRET;
  getClientID = () => this.CLIENT_ID;
  getAppAccessToken = () => this.appAccessToken;
  setSecret = (SECRET: string) => {
    this.SECRET = SECRET;
  };
  setClientID = (CLIENT_ID: string) => {
    this.CLIENT_ID = CLIENT_ID;
  };
  setAppAccessToken = (token: string) => {
    this.appAccessToken = token;
  };

  init = async (CLIENT_ID: string, CLIENT_SECRET: string, log: boolean = false) => {
    this.setClientID(CLIENT_ID);
    this.setSecret(CLIENT_SECRET);
    await requestAppAccessToken(this, log);

    // the app access token will expire every 2 hours.
    setInterval(async () => {
      requestAppAccessToken(this, log);
    }, 7200000);
    // this.refreshAccess = refreshAccess(this);
  };

  /**
   * @param code the code from the login challenge at https://api.ddpurse.com/v1/oauth2/authorize?client_id=...
   * @param redirectUri Must match provided redirect uri in the login challenge
   * @param log whether to log events
   * @example 
  app.post('/auth', async (req, res, next) => {
    const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
    const userAccessToken = authTokenData.access_token;
    res.json({ ...authTokenData });
    });
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

  /**
   * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
   * @param { IAutoPayOrder } orderData a valid order as a js object (see the docs or this IAutoPayOrder type)
   * @returns { IAutoPayResponse | { error: 'balance too low'} } The order response. If balance too low, returns { error: 'balance too low'}
   */
  autoPay = autoPay(this);

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
