const getTxData = (app, dotwallet) =>
  app.post('/get-tx-data', async (req, res) => {
    try {
      const savedData = await dotwallet.getSavedData(req.body.txid, true);
      res.json(savedData);
    } catch (error) {
      console.log('==============error==============\n', error);
      res.json(error);
    }
  });
module.exports = { getTxData };
