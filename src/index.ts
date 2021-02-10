import { getUserToken, getUserInfo } from './methods/userAuth';
import { getOrderID, getOrderStatus } from './methods/order';
import { queryTx } from './methods/query';
import { autoPay, getAutoPayBalance } from './methods/autopay';
import { saveData, getSavedData } from './methods/saveData';
import { requestAppAccessToken } from './methods/appAuth';

class DotWallet {
  CLIENT_ID: string = '';
  SECRET: string = '';
  appAccessToken: string = '';
  // not sure if we need this, seems like the the values are getting repopulated without it
  // populateStaticMethods = () => {
  //   this.getUserToken = getUserToken(this.CLIENT_ID, this.SECRET);
  //   this.paymentOrder = paymentOrder(this.CLIENT_ID, this.SECRET);
  //   this.getOrderStatus = getOrderStatus(this.CLIENT_ID, this.SECRET);
  //   this.autopayment = autopayment(this.SECRET);
  //   this.getHostedAccount = getHostedAccount(this.CLIENT_ID, this.SECRET);
  //   this.hostedAccountBalance = hostedAccountBalance(this.CLIENT_ID, this.SECRET);
  //   this.saveData = saveData(this.CLIENT_ID, this.SECRET);
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

  /**
   * @summary initialize DotWallet with your credentials from DotWallet for Developers
   * @param {boolean} log whether to console.log() internal events
   */
  init = async (CLIENT_ID: string, CLIENT_SECRET: string, log: boolean = false) => {
    this.setClientID(CLIENT_ID);
    this.setSecret(CLIENT_SECRET);
    await requestAppAccessToken(this, log);

    // the app access token will expire every 2 hours.
    setInterval(async () => {
      requestAppAccessToken(this, log);
    }, 7200000);
    // this.populateStaticMethods();
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

  /**
   * @summary Get a user's basic profile information. Permission for this must have been set with the scope "user.info"
   * @param {string} userAccessToken the user access token that includes the scope
   * @param {boolean} log whether to console.log() internal events
   */
  getUserInfo = getUserInfo;

  /**
   * @summary sign an order with your developer key, and send it to dotwallet servers to get an order_sn
   * @param { IOrderData } orderData a valid order as a js object (see the docs or this IorderData type)
   * @param {boolean} log whether to console.log() internal events
   * @returns { string } the order_sn
   */
  getOrderID = getOrderID(this);

  /**
   * @summary Check the status of a dotwallet order.
   * @param {string} orderID the order ID of the payment
   * @param {boolean} log whether to console.log() internal events
   */
  getOrderStatus = getOrderStatus(this);

  /**
   * @summary Send out a payment on behalf of a wallet that has authorized auto-payments
   * @param { IAutoPayOrder } orderData a valid order as a js object (see the docs or this IAutoPayOrder type)
   * @param {boolean} log whether to console.log() internal events
   * @returns { IAutoPayResponse | { error: 'balance too low'} } The order response. If balance too low, returns { error: 'balance too low'}
   */
  autoPay = autoPay(this);

  /**
   * @summary Get the user's automatic payments account balance. **NOTE: Requires user has authorized automatic payments
   * @param {string} coinType currency, BSV, BTC, ETH
   * @param {string} userID the user_id of the wallet you'd like to query
   * @param {boolean} log whether to console.log() internal events
   */
  getAutoPayBalance = getAutoPayBalance(this);

  /**
   * @summary Save data on chain using an automatic payment. **NOTE: Requires wallet has authorized automatic payments and has sufficient balance
   * @param {string|object} data JSON.stringify-able data. Will be converted to hex and saved on chain with the prefix `006a`
   * @param {string} userID the user_id of the wallet providing the funds for the transaction
   * @param {object} options optional fields from an automatic payment order object
   * @param {boolean} log whether to console.log() internal events
   */
  saveData = saveData(this);

  /**
   * @summary Retrieve data stored on the BSV block chain.
   * @param {string} txid the transaction ID of the transaction where the data was saved
   * @param {boolean} log whether to console.log() internal events
   */
  getSavedData = getSavedData(this);

  /**
   * @summary Examine a transaction
   * @param { string } txid The transaction ID you'd like to query
   * @param {boolean} log whether to console.log() internal events
   */
  queryTx = queryTx(this);
}

export = DotWallet;
