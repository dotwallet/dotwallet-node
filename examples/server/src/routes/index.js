const { CLIENT_ID, CLIENT_SECRET } = require('../config');
const DotWallet = require('../../../../lib/index.js');
// const DotWallet = require('dotwallet-node'); //in a real app
const dotwallet = new DotWallet();
dotwallet.init(CLIENT_ID, CLIENT_SECRET);

const { auth } = require('./auth');
const { autoPay, createOrder, paymentResult } = require('./payment');
const { saveData } = require('./saveData');
const { getTxData } = require('./query');

const routes = function (app) {
  auth(app, dotwallet);
  autoPay(app, dotwallet);
  createOrder(app, dotwallet);
  paymentResult(app);
  getTxData(app, dotwallet);
  saveData(app, dotwallet);
};

module.exports = { routes };
