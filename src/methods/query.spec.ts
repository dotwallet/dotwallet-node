import DotWallet from '../index';
import start from '../testUtils';
let dotwallet: DotWallet;
const txid = '55f34c6474e2ac068d293deb4b72c1785c7cfab848ccba63dda9282e03914554';
beforeAll(async () => {
  dotwallet = await start();
});
it('can query transaction', async () => {
  const queryInfo = await dotwallet.queryTx(txid, true);
  console.log({ queryInfo });
  if ('error' in queryInfo) throw queryInfo.error;

  expect(queryInfo).toBeTruthy();
  expect(queryInfo.size).toBeGreaterThan(20);
});

it('can query transaction', async () => {
  const queryInfo = await dotwallet.queryTx(txid, true);
  console.log({ queryInfo });
  if ('error' in queryInfo) throw queryInfo.error;

  expect(queryInfo).toBeTruthy();
  expect(queryInfo.size).toBeGreaterThan(20);
});
