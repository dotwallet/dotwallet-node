const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var ip = require('ip');

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 3000;
const YOUR_CLIENT_SECRET = process.env.CLIENT_SECRET;
const YOUR_CLIENT_ID = process.env.CLIENT_ID;
const DotWallet = require('../../../lib/index.js');
const dotwallet = DotWallet(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src'));

/**
 *
 * ============================AUTHENTICATION============================
 *
 */

app.get('/restricted-page', async (req, res) => {
  res.sendFile(path.join(__dirname + '/restricted-page.html'));
});

let accessTokenStorage = ''; // These would go to your database in a real app
let refreshTokenStorage = '';

app.get('/auth', async (req, res, next) => {
  const authResponse = await dotwallet.handleAuthResponse(req, res, next, '/restricted-page/', true);
  refreshTokenStorage = authResponse.accessData.refresh_token;
  accessTokenStorage = authResponse.accessData.access_token;
});
const refreshAccessToken = (refreshTokenStorage) => {
  dotwallet.refreshAccess(refreshTokenStorage).then((result) => {
    refreshTokenStorage = result.refresh_token;
    accessTokenStorage = result.access_token;
  });
};

/**
 *
 * ============================PAYMENT============================
 *
 */

app.get('/store-front', async (req, res) => {
  res.sendFile(path.join(__dirname + '/store-front.html'));
});
app.get('/order-fulfilled', async (req, res) => {
  res.sendFile(path.join(__dirname + '/order-fulfilled.html'));
});

app.post('/create-order', async (req, res) => {
  const merchant_order_sn = req.body.merchant_order_sn;
  const order_sn = await dotwallet.handleOrder(req.body, true);
  setTimeout(async () => {
    const orderStatus = await dotwallet.getOrderStatus(merchant_order_sn, true);
    console.log('==============orderStatus==============\n', orderStatus);
  }, 1000 * 60);
  res.json({ order_sn });
});

app.get('/payment-result', (req, res) => {
  // the response from 'notice_uri' will be in the request queries
  console.log('==============payment-result req==============\n', req.query);
});

/**
 *
 * ============================AUTOMATIC PAYMENTS============================
 *
 */

app.get('/autopayment-store', async (req, res) => {
  res.sendFile(path.join(__dirname + '/autopayment-store.html'));
});

app.post('/create-autopayment', async (req, res) => {
  const orderResultData = await dotwallet.autopayment(req.body, true);
  console.log('orderResultData', orderResultData);
  res.json(orderResultData);
});

/**
 *
 * ============================SAVE DATA ON CHAIN============================
 *
 */

const savedDataTxns = []; // In real app could store in DB. Save a list of txns to retrieve data

app.post('/save-data', async (req, res) => {
  try {
    const data = req.body;
    // check if recieve address is dev's own
    console.log('==============data==============\n', data);

    const getHostedData = await dotwallet.getHostedAccount('BSV', true);
    console.log('==============getHostedData==============', getHostedData);

    const getBalanceData = await dotwallet.hostedAccountBalance('BSV', true);
    console.log('==============getBalanceData==============', getBalanceData);

    if (getBalanceData.confirm + getBalanceData.unconfirm < 700) throw 'developer wallet balance too low';

    const saveDataData = await dotwallet.saveData(data, 0, true);
    console.log('==============saveDataData==============', saveDataData);
    savedDataTxns.push({
      ...saveDataData.data,
      timestamp: new Date(),
      tag: 'banana-price',
    }); //in a real app this would go to DB
    res.json(saveDataData.data);
  } catch (err) {
    console.log(err.msg, err.data, err.message, err.response);
    console.log('==============err==============\n', err);
    res.json(err);
  }
});

app.listen(PORT, () =>
  console.log(
    `DotWallet example app listening at ${
      process.env.NODE_ENV === 'production' ? 'production host' : ip.address() + ':' + PORT
    }`,
  ),
);
