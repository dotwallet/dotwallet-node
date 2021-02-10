import DotWallet from './index';
import start from './testUtils';
let dotwallet: DotWallet;
beforeAll(async () => {
  dotwallet = await start();
});
it('saves initial environment variables', () => {
  const CLIENT_SECRET = dotwallet.SECRET;
  const CLIENT_ID = dotwallet.CLIENT_ID;
  //   console.log({ CLIENT_ID, CLIENT_SECRET });
  expect(CLIENT_SECRET).toBeDefined();
  expect(CLIENT_ID).toBeDefined();
  expect(CLIENT_SECRET).toBe(process.env.CLIENT_SECRET);
  expect(CLIENT_ID).toBe(process.env.CLIENT_ID);
});
