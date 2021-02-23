const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();
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
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('src'));

// API docs
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DotWallet MicroService',
      version: '1.0.0',
      description: 'A server for using DotWallets APIs',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['index.js'],
};
const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// static pages
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});
app.get('/log-in-redirect', async (req, res) => {
  // client-side page to receive the code after user confirms login. Could be done on the same login page, but separated here to show steps
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

/**
 * @swagger
 * /auth:
 *   post:
 *     produces:
 *       - application/json
 *     parameters
 */
app.post('/auth', async (req, res) => {
  const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
  const userAccessToken = authTokenData.access_token;
  console.log('userAccessToken', userAccessToken);
  const userInfo = await dotwallet.getUserInfo(userAccessToken, true);

  const token = jwt.sign({ userID: '' }, YOUR_CLIENT_SECRET, { expiresIn: req.body.tokenExpiry || '1h' });
  const returnData = { ...userInfo, ...authTokenData, serverToken: token };
  res.json(returnData);
  // optionally alert your main backend server that the login was sucessful, and send the info there.
  // subsequent requests can be made from server or client as long as they have a valid token
  if (req.body.token_redirect) {
    axios.post(req.body.token_redirect, returnData);
  }
});

const checkToken = (req, res, next) => {
  const token = req.body.serverToken;
  try {
    jwt.verify(token, YOUR_CLIENT_SECRET);
    next();
  } catch (error) {
    return { error };
  }
};

/**
 *
 * ============================PAYMENT============================
 *
 */
app.post('/create-order', checkToken, async (req, res) => {
  const order = { ...req.body };
  const orderIDCall = await dotwallet.getOrderID(req.body, true);
  if (orderIDCall.error) res.json(orderIDCall);
  else {
    // optional, check the order status:
    setTimeout(async () => {
      const orderStatus = await dotwallet.getOrderStatus(orderIDCall, true);
      // console.log('orderStatus', orderStatus);
      // optional, check the blockchain transaction
      const tx = await dotwallet.queryTx(orderStatus.txid, true);
      // console.log('tx', tx);
    }, 1000 * 60);

    res.json({ order_id: orderIDCall });
  }
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
app.post('/autopay', checkToken, async (req, res) => {
  // check to make sure user is same as payer user.
  // jwt = { userID: ... }
  const balance = await dotwallet.getAutoPayBalance(req.body.user_id);
  // console.log('balance', balance);
  // check to make sure balance is enough
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
