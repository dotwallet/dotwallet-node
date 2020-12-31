// import { Request, Response, NextFunction } from 'express';
import { getUserToken, getUserInfo, refreshUserToken } from './userAuth';
import { getOrderID, getOrderStatus } from './order';
import { IUserData, IUserAccessTokenData, IPaymentOrder, IAutoPayOrder } from './types';
import { autoPay } from './autopay';
import { saveData, getSavedData } from './saveData';
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
   * @param {boolean} log whether to console.log() internal events
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
   * @param {boolean} log whether to console.log() internal events
   * @returns { string } the order_sn
   */
  getOrderID = getOrderID(this);

  getOrderStatus = getOrderStatus(this);

  /**
   * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
   * @param { IAutoPayOrder } orderData a valid order as a js object (see the docs or this IAutoPayOrder type)
   * @param {boolean} log whether to console.log() internal events
   * @returns { IAutoPayResponse | { error: 'balance too low'} } The order response. If balance too low, returns { error: 'balance too low'}
   */
  autoPay = autoPay(this);

  /**
   * @summary Save data on chain using an automatic payment. **NOTE: Requires wallet has authorized automatic payments and has sufficient balance
   * @param {string|object} data JSON.stringify-able data. Will be converted to hex and saved on chain with the prefix `006a`
   * @param {string} userID the user_id of the wallet providing the funds for the transaction
   * @param {object} options optional fields from an automatic payment order object
   * @param {boolean} log whether to console.log() internal events
   */
  saveData = saveData(this);

  getSavedData = getSavedData(this);
}

export = DotWallet;
