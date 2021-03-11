const axios = require('axios');
const jwt = require('jsonwebtoken');
const { CLIENT_SECRET } = require('../config');

const createToken = (userID, expiresIn = '30 days') => {
  // console.log({ userID, expiresIn }, 1613982737 - 1613986337);
  const token = jwt.sign({ userID }, CLIENT_SECRET, { expiresIn });
  const decoded = jwt.verify(token, CLIENT_SECRET, { ignoreExpiration: true });
  // console.log({ token, decoded }, decoded.iat - decoded.exp);
  return token;
};

/** Checks token and returns userID or an console.error;
 * @returns {{error: any}|string} {{error: any}|string}
 * @param { string } token The JWT token
 */
const checkToken = (token) => {
  try {
    if (!token) throw 'no token received';
    const decoded = jwt.verify(token, CLIENT_SECRET);
    if (!decoded) {
      throw 'invalid token' + JSON.stringify(decoded);
    }
    if (!decoded.userID) {
      throw 'no username found';
    }
    return decoded.userID;
  } catch (error) {
    return { error };
  }
};

/** checks a token from request body, if valid moves to next()
 * @param {{body: {server_token: string}}} req
 */
const checkTokenMiddleWare = (req, res, next) => {
  try {
    const userID = checkToken(req.body.server_token);
    if (typeof userID === 'string' && !userID.error) next();
    else throw userID.error;
  } catch (error) {
    console.log({ error });
    res.json({ error: 'token validation error: ' + JSON.stringify(error) });
  }
};

/**
 * @swagger
 * /auth:
 *   post:
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "code"
 *         description: "code from login redirect"
 *         in: body
 *         required: true
 *         type: string
 *         example: "JUTTUQI2MIAIKWQUMA4J7G"
 *       - name: "redirect_uri"
 *         description: "redirect_uri from login request"
 *         in: body
 *         required: true
 *         type: string
 *         example: "http://localhost:3000/user-landing-page"
 *       - name: "token_redirect_uri"
 *         description: "a POST endpoint. Will send the request response there as well"
 *         in: body
 *         required: false
 *         type: string
 *         example: "http://localhost:3000/api/accept-login-in-redirect"
 *     summary: "Use the 'code' from a user login response to get the user_access_token, server_token, and user info."
 *     description: "NOTE: all subsequent requests to this server require the 'server_token' that this step returns. Because in most situations, when handling a user login redirect request, the app will also want to get the user info, so this endpoint condenses those 2 steps into 1"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   description: "the user's profile picture"
 *                   example: "https://bq-frontend.oss-cn-hongkong.aliyuncs.com/avatar/1596185502744190.jpeg"
 *                 nickname:
 *                   type: string
 *                   description: the user's alias
 *                   example: "clever name"
 *                 id:
 *                   type: string
 *                   description: the user's ID
 *                   example: 47ff7d23ba6f06703e28347da4889e5b
 *                 web_wallet_address:
 *                   description: the user's wallets
 *                   type: object
 *                   properties:
 *                     bsv_regular:
 *                       type: string
 *                       example: 15QHSnYBtBMlXn2JGHghvc35M7BD38KhyR
 *                     btc_regular:
 *                       type: string
 *                       example: 15QHSnYBtBMlXn2JGHghvc35M7BD38KhyR
 *                     eth_regular:
 *                       type: string
 *                       example: 0x75695c27B4c84088E9dB48C43935D644Eb83F8C3
 *                 access_token:
 *                   type: string
 *                   description: user access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI...
 *                 expires_in:
 *                   type: number
 *                   description: expiration (in seconds)
 *                   example: 7200
 *                 refresh_token:
 *                   type: string
 *                   description: user access token refresh token
 *                   example: VW9DLC0BVHKFFSWH2RGBUA
 *                 scope:
 *                   type: string
 *                   description: the scopes that the user has authorized to the app
 *                   example: user.info autopay.bsv
 *                 token_type:
 *                   type: string
 *                   description: set value - Bearer
 *                   example: Bearer
 *                 server_token:
 *                   type: string
 *                   description: a token that authorizes the use of this micro service server
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI..
 */
const auth = (app, dotwallet) =>
  app.post('/auth', async (req, res) => {
    const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
    const userAccessToken = authTokenData.access_token;
    const userInfo = await dotwallet.getUserInfo(userAccessToken, true);

    const serverToken = createToken(userInfo.id);
    const returnData = { ...userInfo, ...authTokenData, server_token: serverToken };
    // console.log({ returnData });
    res.json(returnData);
    // optionally alert your main backend server that the login was successful, and send the info there.
    // subsequent requests can be made from server or client as long as they have a valid token
    if (req.body.token_redirect_uri) {
      axios.post(req.body.token_redirect_uri, returnData);
    }
  });

module.exports = { auth, checkToken, checkTokenMiddleWare };
