import supertest from 'supertest';
//@ts-ignore
import testApp from './testApp';
import * as http from 'http';
export const request = () => supertest(http.createServer(testApp.callback()));
export const agent = supertest.agent(http.createServer(testApp.callback()));
describe('Pingger', () => {
  it('Pings succesffully', async () => {
    const res = await request().get('/ping').send();
    // console.log('ping test result', result);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('pong!');
  });
});
