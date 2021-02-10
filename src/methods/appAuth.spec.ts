import DotWallet from '../index';
import start from '../testUtils';
let dotwallet: DotWallet;
beforeAll(async () => {
  dotwallet = await start();
});
it('gets token', () => {
  const token = dotwallet.getAppAccessToken();
  //   console.log({ tokenData });
  expect(token).toBeTruthy();
  expect(token.length).toBeGreaterThan(20);
});
