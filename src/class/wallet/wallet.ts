import nemSdk from 'nem-sdk';
import { Account, Password, Pageable, NemAnnounceResult, SimpleWallet, Transaction } from 'nem-library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Nem from '../nem';
import { AccountData, SendParameters } from '../wallet/data-class';

export default class Wallet {
  public address: string = '';
  public publicKey: string = '';
  public walletName: string = 'tip-pocket';

  private nem: Nem = new Nem();
  private walletPassword: string = 'tip-pocket-nem-wallet';

  set setPublicData(data: { address: string, publicKey: string }) {
    this.address = data.address;
    this.publicKey = data.publicKey;
  }

  public createAccount(): SimpleWallet {
    const account = this.nem.createAccount(this.walletName, this.walletPassword);
    this.address = account.address.plain();
    this.publicKey = account.open(new Password(this.walletPassword)).publicKey;
    return account;
  }

  // 暗号化してある秘密鍵を複合する
  public decrypto(): string {
    const common = nemSdk.model.objects.create('common')(this.walletPassword, '');
    const key = this.getKey;
    if (key) {
      nemSdk.crypto.helpers.passwordToPrivatekey(common, key, 'pass:bip32');
      return common.privateKey;
    }

    return '';
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

  public send(parameters: SendParameters): Observable<NemAnnounceResult> {
    const privateKey = this.decrypto();
    const account = Account.createWithPrivateKey(privateKey);
    return this.nem.send(account, parameters);
  }

  private getKey(): { encryptedKey: string, iv: string } | null {
    const storageName = `${this.walletName}-key`;
    const keyJson = localStorage.getItem(storageName);
    if (keyJson) {
      return JSON.parse(keyJson);
    } else {
      return null;
    }
  }
}
