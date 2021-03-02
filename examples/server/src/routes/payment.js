const { checkToken } = require('./auth');

/**
 * @swagger
 * /create-order:
 *   post:
 *     summary: asdfasdf
 *     description: asdflakjef
 *     required: true
 */
const createOrder = (app, dotwallet) =>
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

/**
 * @swagger
 * /payment-result:
 *   post:
 *     description: asdfasdf
 */
const paymentResult = (app) =>
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
const autoPay = (app, dotwallet) =>
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

module.exports = { autoPay, createOrder, paymentResult };
