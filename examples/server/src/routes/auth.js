const axios = require('axios');
const jwt = require('jsonwebtoken');
const { CLIENT_SECRET } = require('../config');
const checkToken = (req, res, next) => {
  try {
    const token = req.body.serverToken;
    console.log({ token });
    if (!token) throw 'no token';
    jwt.verify(token, CLIENT_SECRET);
    next();
  } catch (error) {
    res.json({ error: 'token validation error: ' + JSON.stringify(error) });
  }
};

/**
 * @swagger
 * /example:
 *   post:
 *     summary: "Use the 'code' from a user login response to get the user_access_token, server_token, and user info."
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "param_name"
 *         description: "매개변수"
 *         in: body
 *         required: true
 *         type: string
 *         example: "foo"
 *     responses:
 *       200:
 *         description: "성공"
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               description: "성공 여부"
 *               type: boolean
 *               example: true
 *       400:
 *         description: "잘못된 매개변수"
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               description: "성공 여부"
 *               type: boolean
 *               example: false
 *       500:
 *         description: "서버 오류"
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               description: "성공 여부"
 *               type: boolean
 *               example: false
 */

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
    console.log({ reqBody: req.body });
    const authTokenData = await dotwallet.getUserToken(req.body.code, req.body.redirect_uri, true);
    const userAccessToken = authTokenData.access_token;
    console.log('userAccessToken', userAccessToken);
    const userInfo = await dotwallet.getUserInfo(userAccessToken, true);

    const token = jwt.sign({ userID: userInfo.id }, CLIENT_SECRET, { expiresIn: '60d' });
    const returnData = { ...userInfo, ...authTokenData, server_token: token };
    console.log({ returnData });
    res.json(returnData);
    // optionally alert your main backend server that the login was successful, and send the info there.
    // subsequent requests can be made from server or client as long as they have a valid token
    if (req.body.token_redirect_uri) {
      axios.post(req.body.token_redirect_uri, returnData);
    }
  });

module.exports = { auth, checkToken };
