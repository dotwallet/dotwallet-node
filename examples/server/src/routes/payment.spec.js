const supertest = require('supertest');
const { app } = require('../index.js');
const { CLIENT_SECRET } = require('../config');
const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');
const server_token = jwt.sign({ userID: '123' }, CLIENT_SECRET);
const request = () => supertest(app);
const validOrder = {
  server_token,
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
  notify_url: 'http://localhost:3000/payment-result',
};
describe('POST /create-order', () => {
  it('can create an order_id', async () => {
    const res = await request().post('/create-order').send(validOrder);
    console.log({ res: res.body });
    expect(res.body.order_id.length).toBeGreaterThan(15);
  });
});
