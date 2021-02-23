import DotWallet from './index';
import dotenv from 'dotenv';
dotenv.config();
const start = async () => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const dotwallet = new DotWallet();
  // console.log({ CLIENT_ID, CLIENT_SECRET });
  if (!CLIENT_ID || !CLIENT_SECRET) throw 'unable to find envs';
  await dotwallet.init(CLIENT_ID, CLIENT_SECRET);
  return dotwallet;
};

export default start;
