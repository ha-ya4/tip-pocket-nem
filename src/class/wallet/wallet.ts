import nemSdk from 'nem-sdk';
import { Account, Password, PlainMessage } from 'nem-library';

import Nem from '../nem';
import { AccountData, SendParameters } from '../wallet/data-class'

export default class Wallet {
  public address: string = '';
  public iv: string = '';
  public privateKey: string = '';
  public publicKey: string = '';
  public balance: number = 0;

  private nem: Nem;
  private storageName = 'account-data';

  constructor(walletName: string, password: string) {
    this.nem = new Nem(walletName, password);
    const acc = this.accountDataLoad();

    // アカウントの情報がなければ新規作成してローカルストレージに保存
    if (acc === null) {
      // アカウント作成
      const account = this.nem.createAccount();
      this.address = account.address.plain();
      this.privateKey = account.encryptedPrivateKey.encryptedKey;
      this.iv = account.encryptedPrivateKey.iv;
      this.publicKey = account.open(new Password(password)).publicKey;

      // アカウントのデータをローカルストレージにセット
      this.accountDataSave();

      // アカウントの情報があればプロパティにセット
    } else {
      this.address = acc.address;
      this.iv = acc.iv;
      this.privateKey = acc.privateKey;
      this.publicKey = acc.publicKey;
    }

    this.getBalance()
    //this.send('tp-wallet', new SendParameters(0,PlainMessage.create('hello'),'NDZG7C-EBFVFQ-AEHRLI-WFZV3X-RTSTH7-BZUPEP-OI7J'))
  }

  public getBalance() {
    this.nem.getBalance(this.address).subscribe((balance) => {
      this.balance = balance;
    });
  }

  public send(password: string, parameters: SendParameters) {
    const privateKey = this.decrypto(password);
    const account = Account.createWithPrivateKey(privateKey);
    this.nem.send(account, parameters)
  }

  // ローカルストレージからNEMアカウントを取得
  private accountDataLoad(): AccountData | null {
    const accountJson = localStorage.getItem(this.storageName);

    if (accountJson) {
      return JSON.parse(accountJson);
    } else {
      return null;
    }
  }

  private accountDataSave() {
    const accountData = JSON.stringify({
      address: this.address,
      iv: this.iv,
      privateKey: this.privateKey,
      publicKey: this.publicKey,
    });
    localStorage.setItem(this.storageName, accountData);
  }

  // 暗号化してある秘密鍵を複合する
  private decrypto(password: string): string {
    const common = nemSdk.model.objects.create('common')(password, '');
    const key = {
      encrypted: this.privateKey,
      iv: this.iv,
    };
    nemSdk.crypto.helpers.passwordToPrivatekey(common, key, 'pass:bip32');
    return common.privateKey;
  }
}
