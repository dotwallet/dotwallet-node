const saveData = (app, dotwallet) =>
  app.post('/save-data', async (req, res) => {
    const saveDataResult = await dotwallet.saveData(req.body.dataToSave, req.body.userID, undefined, true);
    res.json(saveDataResult);
  });
module.exports = { saveData };
