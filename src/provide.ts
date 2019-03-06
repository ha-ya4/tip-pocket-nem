import Wallet from '@/class/wallet';

export const provide = {
  ['WALLET_SERVICE']: new Wallet(),
};
