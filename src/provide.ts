import Wallet from '@/class/wallet/wallet';

export const provide = {
  ['WALLET_SERVICE']: new Wallet('tip-pocket', 'tp-wallet'),
};
