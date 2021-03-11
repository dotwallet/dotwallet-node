const { checkTokenMiddleWare, checkToken } = require('./auth');

/**
 * @swagger
 * /save-data:
 *   post:
 *     summary: Saves data using an automatic payment.
 *     description: Data must be able to be JSON.stringify()-ed. User must have authorized auto payments. Returns an automatic payment result. You can use the txid to recover the data later.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_to_save:
 *                 type: object
 *               user_id:
 *                 type: string
 *               server_token:
 *                 type: string
 *                 required: true
 *                 example: test_token
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 order_id:
 *                   type: string
 *                 out_order_id:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 amount:
 *                   type: string
 *                 fee:
 *                   type: string
 *                 txid:
 *                   type: string
 */
const saveData = (app, dotwallet) =>
  app.post('/save-data', checkTokenMiddleWare, async (req, res) => {
    const userID = req.body.user_id;
    // console.log({ reqBody: req.body });
    const tokenUserID = checkToken(req.body.server_token);
    // console.log({ tokenUserID, userID, equal: tokenUserID === userID });
    if (tokenUserID !== userID) {
      res.json({ error: 'error processing transaction' });
      return;
    }
    const saveDataResult = await dotwallet.saveData(req.body.data_to_save, userID, undefined, true);
    res.json(saveDataResult);
  });
module.exports = { saveData };
