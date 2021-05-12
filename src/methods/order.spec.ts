import DotWallet from '../index';
import start from '../testUtils';
import { v4 as uuid } from 'uuid';
let dotwallet: DotWallet;
const order = {
  out_order_id: uuid(),
  coin_type: 'BSV',
  to: [
    {
      type: 'address',
      content: '1L3z6DzHpfr7pkkZmKfVNMjwY1984D5YRv',
      amount: 546,
    },
  ],
  product: {
    id: uuid(),
    name: 'bananas',
    detail: 'A lovely bunch of bananas',
  },
  subject: 'an order of fresh bananas',
  notify_url: 'localhost:3000/payment-result', // replace  with your IP
};
beforeAll(async () => {
  dotwallet = await start();
});
it('creates order ID', async () => {
  const orderID = await dotwallet.getOrderID(order);
  //   console.log({ orderID });
  expect(typeof orderID).toBe('string');
  if (typeof orderID !== 'string') {
    if (orderID.error) throw orderID.error;
    else throw 'error getting orderID';
  }
  expect(orderID).toBeTruthy();
  expect(orderID.length).toBeGreaterThan(10);
});
it('does not accept wrong coin type', async () => {
  const inValidOrder = JSON.parse(JSON.stringify(order));
  inValidOrder.coin_type = 'not BSV ETH or BTC';
  const orderID = await dotwallet.getOrderID(inValidOrder);
  //   console.log({ orderID });
  expect(typeof orderID).not.toBe('string');
  if (typeof orderID === 'string') {
    throw 'error not thrown';
  }
  expect(orderID.error.code).toBe(10180001);
  expect(orderID.error.msg).toContain('CoinType');
});
it('does not accept invalid URL', async () => {
  const inValidOrder = JSON.parse(JSON.stringify(order));
  inValidOrder.notify_url = 'not a url';
  const orderID = await dotwallet.getOrderID(inValidOrder);
  //   console.log({ orderID });
  expect(typeof orderID).not.toBe('string');
  if (typeof orderID === 'string') {
    throw 'error not thrown';
  }
  expect(orderID.error.code).toBe(10180001);
  expect(orderID.error.msg).toContain('NotifyUrl');
});
it('does not accept invalid URL', async () => {
  const inValidOrder = JSON.parse(JSON.stringify(order));
  inValidOrder.out_order_id = null;
  const orderID = await dotwallet.getOrderID(inValidOrder);
  //   console.log({ orderID });
  expect(typeof orderID).not.toBe('string');
  if (typeof orderID === 'string') {
    throw 'error not thrown';
  }
  expect(orderID.error.code).toBe(10180001);
  expect(orderID.error.msg).toContain('OutOrderID');
});
