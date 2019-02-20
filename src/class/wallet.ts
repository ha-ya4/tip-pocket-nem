import Nem from '../class/nem';

export default class Wallet {
  private address: string = '';
  private balance: number = 0;
  private nem: Nem = new Nem();
  private loaclStorageKey = 'acoount-data';
  private publicKey: string = '';

  constructor() {
    const account = this.accountDataLoad();

    if (account === null) {
      const newAccount = this.nem.createAccount(this.loaclStorageKey, this.loaclStorageKey);
      this.address = newAccount.address;

      const accountData = JSON.stringify({
        address: newAccount.address,
        publicKey: '',
      });
      localStorage.setItem(this.loaclStorageKey, accountData);

      const privateKey = JSON.stringify({ key: newAccount.privateKey });
      localStorage.setItem('key', privateKey);
    } else {
      this.address = account.address;
      this.publicKey = account.publicKey;
    }
  }

  private accountDataLoad(): {address: string, publicKey: string} | null {
    const accountJson = localStorage.getItem(this.loaclStorageKey);
    let account: {address: string, publicKey: string} | null = {
      address: '',
      publicKey: '',
    };

    if (accountJson) {
      const acc = JSON.parse(accountJson);
      account.address = acc.address;
      account.publicKey = acc.publicKey;
    } else {
      account = null;
    }

    return account;
  }
}
