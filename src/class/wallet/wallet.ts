import nemSdk from 'nem-sdk';
import { Account, Password, Pageable, NemAnnounceResult, Transaction } from 'nem-library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Nem from '../nem';
import { AccountData, SendParameters } from '../wallet/data-class';

export default class Wallet {
  public address: string = '';
  public iv: string = '';
  public privateKey: string = '';
  public publicKey: string = '';

  private nem: Nem;
  private storageName = 'account-data';

  constructor(walletName: string, password: string) {
    this.nem = new Nem();
    const account = this.accountDataLoad();

    // アカウントの情報がなければ新規作成してローカルストレージに保存
    if (account === null) {
      // アカウント作成
      this.createAccount(walletName, password);

      // アカウントの情報があればプロパティにセット
    } else {
      this.address = account.address;
      this.iv = account.iv;
      this.privateKey = account.privateKey;
      this.publicKey = account.publicKey;
    }
  }

  public getAllTransactionsPaginated(): Pageable<Transaction[]> {
    return this.nem.getAllTransactionsPaginated('NDZG7CEBFVFQAEHRLIWFZV3XRTSTH7BZUPEPOI7J');
  }

  public getBalance(): Observable<number> {
    return this.nem.getBalance(this.address).pipe(
      map((data) => data.balance.balance / this.nem.getDivisibility()),
    );
  }

  public getDivisibility(): number {
    return this.nem.getDivisibility();
  }

  public send(password: string, parameters: SendParameters): Observable<NemAnnounceResult> {
    const privateKey = this.decrypto(password);
    const account = Account.createWithPrivateKey(privateKey);
    return this.nem.send(account, parameters);
  }

  // ローカルストレージからNEMアカウントを取得
  private accountDataLoad(): AccountData | null {
    const account = localStorage.getItem(this.storageName);

    if (account) {
      const acc = JSON.parse(account);
      return new AccountData(acc.address, acc.iv, acc.privateKey, acc.publicKey);
    }

    return null;
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

  private createAccount(walletName: string, password: string) {
    const account = this.nem.createAccount(walletName, password);
    this.address = account.address.plain();
    this.privateKey = account.encryptedPrivateKey.encryptedKey;
    this.iv = account.encryptedPrivateKey.iv;
    this.publicKey = account.open(new Password(password)).publicKey;

    // アカウントのデータをローカルストレージにセット
    this.accountDataSave();
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
