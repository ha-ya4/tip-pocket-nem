import Nem from '../class/nem';
import nemSdk from 'nem-sdk';
import { AccountInfoWithMetaData, Password } from 'nem-library';

interface AccountData {
  address: string;
  iv: string;
  privateKey: string;
  publicKey: string;
}

export default class Wallet {
  public address: string = '';
  public iv: string = '';
  public privateKey: string = '';
  public publicKey: string = '';

  private balance: number = 0;
  private nem: Nem;
  private storageName = 'account-data';

  constructor(walletName: string, password: string) {
    this.nem = new Nem(walletName, password);
    const acc = this.accountDataLoad();

    // アカウントの情報がなければ新規作成してローカルストレージに保存
    if (acc === null) {
      const account = this.nem.createAccount();
      this.address = account.address.plain();
      this.privateKey = account.encryptedPrivateKey.encryptedKey;
      this.iv = account.encryptedPrivateKey.iv;
      this.publicKey = account.open(new Password(password)).publicKey;

      const accountData = JSON.stringify({
        address: this.address,
        iv: this.iv,
        privateKey: this.privateKey,
        publicKey: this.publicKey,
      });
      localStorage.setItem(this.storageName, accountData);
      // アカウントの情報があればプロパティにセット
    } else {
      this.address = acc.address;
      this.iv = acc.iv;
      this.privateKey = acc.privateKey;
      this.publicKey = acc.publicKey;
    }
  }

  // 暗号化してある秘密鍵を複合する
  public decrypto(password: string): string {
    const common = nemSdk.model.objects.create('common')(password, '');
    const key = {
      encrypted: this.privateKey,
      iv: this.iv,
    };
    nemSdk.crypto.helpers.passwordToPrivatekey(common, key, 'pass:bip32');
    return common.privateKey;
  }

  public getAccount() {
    this.nem.getAccount(this.address).subscribe((data: AccountInfoWithMetaData) => {
      console.log(data);
    });
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
}
