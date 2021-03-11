const supertest = require('supertest');
const { app } = require('./index.js');
const DotWallet = require('../../../lib/index');
const { CLIENT_ID } = require('./config');
const request = () => supertest(app);
module.exports = { app, request };
describe('Setup', () => {
  it('Pings successfully', async () => {
    const res = await request().get('/ping');
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('pong!');
  });
  it('loads CLIENT_ID and CLIENT_SECRET', async () => {
    const SECRET = process.env.CLIENT_SECRET;
    expect(SECRET.length).toBeGreaterThan(18);
    expect(CLIENT_ID.length).toBeGreaterThan(18);
    const dotwallet = new DotWallet();
    const appAccessToken = await dotwallet.init(CLIENT_ID, SECRET, false);
    expect(appAccessToken.error).toBeFalsy();
    expect(appAccessToken.access_token.length).toBeGreaterThan(18);
  });
});
describe('Docs', () => {
  it('builds and serves docs', async () => {
    const docsHTML = await (await request().get('/docs').redirects()).text;
    // console.log({ docsHTML });
    expect(docsHTML.includes('Swagger UI<')).toBeTruthy();
  });
});
