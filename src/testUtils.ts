import DotWallet from './index';
const start = async () => {
  const dotwallet = new DotWallet();
  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) throw 'unable to find envs';
  await dotwallet.init(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
  return dotwallet;
};

export default start;
