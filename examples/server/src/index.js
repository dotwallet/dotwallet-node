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
// const DotWallet = require('dotwallet-node'); //in a real app
const dotwallet = new DotWallet();
dotwallet.init(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET, true);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('src'));

// static pages
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
// client-side page to receive the code after user confirms login. Could be done on the same login page, but separated here to show steps
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
app.post('/auth', async (req, res) => {
  const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
  const userAccessToken = authTokenData.access_token;
  console.log('userAccessToken', userAccessToken);
  const userInfo = await dotwallet.getUserInfo(userAccessToken, true);
  res.json({ ...userInfo, ...authTokenData });
});

/**
 *
 * ============================PAYMENT============================
 *
 */
app.post('/create-order', async (req, res) => {
  const order = { ...req.body };
  const orderID = await dotwallet.getOrderID(req.body, true);

  // optional, check the order status:
  setTimeout(async () => {
    const orderStatus = await dotwallet.getOrderStatus(orderID, true);
    // console.log('orderStatus', orderStatus);
    // optional, check the blockchain transaction
    const tx = await dotwallet.queryTx(orderStatus.txid, true);
    // console.log('tx', tx);
  }, 1000 * 60);
  res.json({ order_id: orderID });
});

app.post('/payment-result', (req, res) => {
  // the response from 'notice_uri' will be in the request queries
  console.log('==============payment-result req==============\n', req.body);
  res.json({ code: 1 });
});

/**
 *
 * ============================AUTOMATIC PAYMENTS============================
 *
 */
app.post('/autopay', async (req, res) => {
  const balance = await dotwallet.getAutoPayBalance(req.body.user_id);
  // console.log('balance', balance);
  const orderResultData = await dotwallet.autoPay(req.body, true);
  // console.log('orderResultData', orderResultData);
  res.json(orderResultData);
});

/**
 *
 * ============================SAVE DATA ON CHAIN============================
 *
 */
const savedDataTxns = []; // In real app could store in DB. Save a list of txns to retrieve data

app.post('/save-data', async (req, res) => {
  const saveDataResult = await dotwallet.saveData(req.body.dataToSave, req.body.userID, undefined, true);
  savedDataTxns.push({
    ...saveDataResult,
    timestamp: new Date(),
    tag: 'banana-price',
  }); //in a real app this would go to DB
  res.json(saveDataResult);
});

app.post('/get-tx-data', async (req, res) => {
  try {
    const savedData = await dotwallet.getSavedData(req.body.txid, true);
    res.json(savedData);
  } catch (error) {
    console.log('==============error==============\n', error);
    res.json(error);
  }
});

app.listen(PORT, () =>
  console.log(
    `DotWallet example app listening at ${process.env.NODE_ENV === 'production' ? 'production host' : appUrl}`,
  ),
);
