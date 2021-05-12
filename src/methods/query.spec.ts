import DotWallet from '../index';
import start from '../testUtils';
import { ITXInquiry, IVinVout } from '../types';
let dotwallet: DotWallet;
const txid = '55f34c6474e2ac068d293deb4b72c1785c7cfab848ccba63dda9282e03914554';
const dummyQueryInfo = ({
  transaction_hash = '',
  vins = [],
  vouts = [],
  height = 2,
  size = 2,
  timestamp = 2,
  confirmation = 2,
}: Partial<ITXInquiry> = {}): ITXInquiry => ({
  transaction_hash,
  vins,
  vouts,
  height,
  size,
  timestamp,
  confirmation,
});

beforeAll(async () => {
  dotwallet = await start();
});
it('can query transaction', async () => {
  const queryInfo = await dotwallet.queryTx(txid, true);
  if ('error' in queryInfo) throw queryInfo.error;
  expect(queryInfo).toBeTruthy();
  expect(queryInfo.size).toBeGreaterThan(20);

  const checkObjectHasAllKeys = (obj1: any, model: Object) => {
    let clean = true;
    Object.keys(model).forEach((key) => {
      if (!Object.keys(obj1).includes(key)) clean = false;
    });

    return clean;
  };
  // data is right basic shape:
  // make sure invalid data isn't accepted
  const missingKeys = { size: 10, transaction_hash: '23423' };
  expect(checkObjectHasAllKeys(missingKeys, dummyQueryInfo())).toBeFalsy();
  expect(checkObjectHasAllKeys(queryInfo, dummyQueryInfo())).toBeTruthy();
});
