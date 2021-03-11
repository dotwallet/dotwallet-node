const jwt = require('jsonwebtoken');
const { app } = require('../index.spec');
const { CLIENT_SECRET } = require('../config');
const { checkToken } = require('./auth');
const validToken = jwt.sign({ userID: '123' }, CLIENT_SECRET);
describe('checkToken', () => {
  it('accepts valid token', async () => {
    // console.log({ validToken });
    const res = checkToken(validToken);
    // console.log({ res });
    expect(res.error).toBeFalsy();
    expect(res).toBe('123');
  });
  it('rejects invalid token', async () => {
    const res = checkToken({ body: { server_token: 'eyasdfasdf' } });
    // console.log({ res });
    expect(typeof res).not.toBe('string');
    expect(res.error).toBeTruthy();
  });
  // POST /auth is hard to unit test because it requires a `code` from a real user login
});
