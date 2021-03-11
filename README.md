# dotwallet-node

A node.js SDK for quickly building a server that uses DotWallet for Developers' APIs for logins, payments, and other blockchain services.

This SDK automatically handles the refreshing of user and app access tokens and provides common error handling.

## To use

```bash
npm install dotwallet-node
```

```js
const express = require('express'); // or Koa, etc.
const app = express();

const DotWallet = require('dotwallet-node');
const dotwallet = new DotWallet();
// Initialize DotWallet with your client_id and secret
dotwallet.init('<YOUR_CLIENT_ID>', '<YOUR_CLIENT_SECRET>', true);
// Note: The last param of each call 'true' is for logging. It can be omitted if you don't want to see logs.

// ***** Handle user login and getting user info. *****
app.post('/auth', async (req, res) => {
  const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri);
  const userAccessToken = authTokenData.access_token;
  const userInfo = await dotwallet.getUserInfo(userAccessToken);
  res.json({ ...userInfo, ...authTokenData });
});

// ***** Handle payment order *****
app.post('/create-order', async (req, res) => {
  const order = { ...req.body }; // must be valid order format, examine the IPaymentOrder type, or the dotwallet docs page for format schema
  const orderID = await dotwallet.getOrderID(req.body);
  res.json({ order_id: orderID });
});

// ***** Handle Automatic payment order *****
app.post('/autopay', async (req, res) => {
  // Note: if the user balance is too low, this will send an error back. Redirect the user to move funds to their autopay account, then retry the transaction.
  const orderResultData = await dotwallet.autoPay(req.body);
  res.json(orderResultData);
});

// ***** Save data to the BSV blockchain *****
app.post('/save-data', async (req, res) => {
  const saveDataResult = await dotwallet.saveData(req.body.data_to_save, req.body.userID);
  // You will receive back a txid. In a real app this txid would be stored to DB to later check the saved data on the blockchain
});
```

## Examples

For more complete examples, see the example server in the package in the [`examples/server/src/index.js`](https://github.com/dotwallet/dotwallet-node/blob/main/examples/server/src/index.js) file.

### build

```bash
npm i
npm run build
```

will build to 'lib' folder

### run example

build sdk first, then example

```bash
cd examples/server/
npm i
npm run dev
```

### Test

the tests expect a .env file in the root with CLIENT_ID and CLIENT_SECRET

```
npm run test
#or
npm run test:watch
```
