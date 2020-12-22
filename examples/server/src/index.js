const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var ip = require('ip');
const url = require('url');
const PORT = process.env.PORT || 3000;
const appUrl = 'http://' + ip.address() + ':' + PORT;
const YOUR_CLIENT_SECRET = process.env.CLIENT_SECRET;
const YOUR_CLIENT_ID = process.env.CLIENT_ID;
const DotWallet = require('../../../lib/index.js');
const dotwallet = new DotWallet();
dotwallet.init(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src'));

// static pages
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
// client-side page to receive the code after user confirms login
app.get('/log-in-redirect', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/log-in-redirect.html'));
});
app.get('/logged-in', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/logged-in.html'));
});
app.get('/store-front', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/store-front.html'));
});
/**
 *
 * ============================AUTHENTICATION============================
 *
 */

app.post('/auth', async (req, res, next) => {
  const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
  const userAccessToken = authTokenData.access_token;
  const userData = dotwallet.getUserInfo(userAccessToken, true);
  res.json({ ...userData, ...authTokenData });
});

/**
 *
 * ============================PAYMENT============================
 *
 */

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
    `DotWallet example app listening at ${process.env.NODE_ENV === 'production' ? 'production host' : appUrl}`,
  ),
);
