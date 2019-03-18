import Wallet from '@/ts/wallet';

export const provide = {
  ['WALLET_SERVICE']: new Wallet(),
};
