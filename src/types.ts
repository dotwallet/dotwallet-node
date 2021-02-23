export interface IAppAccessTokenData {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
}
export interface IUserAccessTokenData {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  refresh_token: string;
  scope: string;
}

export interface IUserData {
  id: string;
  nickname: string;
  avatar: string;
  web_wallet_address: {
    bsv_regular: string;
    btc_regular: string;
    eth_regular: string;
  };
}

export interface IPaymentToObject {
  type: 'address' | 'script' | string;
  content: string;
  amount: number;
}

export interface IOrder {
  out_order_id: string;
  coin_type: 'BSV' | 'BCH' | 'ETH' | string;
  to: IPaymentToObject[];
  product: {
    id: string;
    name: string;
    detail?: string;
  };
  badge_code?: string;
  subject?: string;
  notify_url?: string;
}
export interface IPaymentOrder extends IOrder {
  redirect_uri?: string;
  expires?: number;
}
export interface IAutoPayOrder extends IOrder {
  user_id: string;
}

interface Vin {
  address: string;
  amount: number;
  index: number;
}
interface Vout {
  address: string;
  amount: number;
  index: number;
}

interface Transaction {
  blockhash: string;
  blockheight: number;
  confirmation?: number;
  fee: number;
  time: number;
  vins: Vin[];
  vouts: Vout[];
}
export interface IPaymentQuery {
  amount: number;
  coin_type: 'BSV' | 'BCH' | 'BSV';
  created_at: number;
  order_id: string;
  out_order_id: string;
  payer_user_id: string;
  product_detail: string;
  product_id: string;
  product_name: string;
  status: number;
  confirmation?: number;
  subject: string;
  transaction: Transaction;
  txid: string;
}

export interface IAutoPayResponse {
  order_id: string;
  out_order_id: string;
  user_id: string;
  amount: number;
  fee: number;
  txid: string;
}

export interface IAutoPayBalance {
  /** Confirmed Balance */
  confirm: number;
  /** Unconfirmed Balance */
  unconfirm: number;
}

export interface IVinVout {
  index: number;
  script_hex: string;
  value: number;
}

export interface ITXInquiry {
  transaction_hash: string;
  vins: IVinVout[];
  vouts: IVinVout[];
  height: number;
  size: number;
  timestamp: number;
  confirmation: number;
}
