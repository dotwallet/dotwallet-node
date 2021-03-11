const { checkTokenMiddleWare } = require('./auth');

/**
 * @swagger
 * /get-data-from-tx:
 *   post:
 *     summary: Returns data that has been saved (using this API) to a certain txid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               txid:
 *                 type: string
 *                 required: true
 *                 example: 55f34c6474e2ac068d293deb4b72c1785c7cfab848ccba63dda9282e03914554
 *               server_token:
 *                 type: string
 *                 required: true
 *                 example: test_token
 *   responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 transaction_hash:
 *                   type: string
 *                 height:
 *                   type: number
 *                 size:
 *                   type: number
 *                 timestamp:
 *                   type: number
 *                 confirmation:
 *                   type: number
 *                 vins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       script_hex:
 *                         type: string
 *                       value:
 *                         type: number
 *                 vouts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       script_hex:
 *                         type: string
 *                       value:
 *                         type: number
 *
 *  */
const getTxData = (app, dotwallet) =>
  app.post('/get-data-from-tx', checkTokenMiddleWare, async (req, res) => {
    try {
      const savedData = await dotwallet.getSavedData(req.body.txid, true);
      res.json(savedData);
    } catch (error) {
      console.log('==============error==============\n', error);
      res.json(error);
    }
  });
module.exports = { getTxData };
