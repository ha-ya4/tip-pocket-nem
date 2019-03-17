import nemSdk from 'nem-sdk';
import {
  Account,
  Address,
  EncryptedMessage,
  Password,
  Pageable,
  PlainMessage,
  PublicAccount,
  NemAnnounceResult,
  SimpleWallet,
  Transaction,
  QRService,
} from 'nem-library';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import Nem from './nem';
import { SendParameters } from '@/types/data-class';

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

  public createWithPrivateKey(privateKey: string): SimpleWallet {
    const account = this.nem.createWithPrivateKey(this.walletName, this.walletPassword, privateKey);
    this.address = account.address.plain();
    this.publicKey = account.open(new Password(this.walletPassword)).publicKey;
    return account;
  }

  public createPlainMessage(message: string): Observable<PlainMessage> {
    return of(PlainMessage.create(message));
  }

  // アドレスから送金先のメタデータを取得してそこから公開鍵を使う
  public createEncryptoMessage(
    message: string, privateKey: string, recipientAddress: string,
  ): Observable<EncryptedMessage | null>
  {
    return this.nem.getAccountInfoWithMetaData(recipientAddress).pipe(
      map((data) => {
        if (data.publicAccount === undefined) { return null }
        const publicKey = data.publicAccount.publicKey;
        const publicAccount = PublicAccount.createWithPublicKey(publicKey);
        const account = Account.createWithPrivateKey(privateKey);
        return account.encryptMessage(message, publicAccount)
      }),
    );
  }

  // 暗号化してある秘密鍵を複合する
  public decrypto(encryptedKey: {encryptedKey: string, iv: string }): string {
    const common = nemSdk.model.objects.create('common')(this.walletPassword, '');
    const keyObject = {
      encrypted: encryptedKey.encryptedKey,
      iv: encryptedKey.iv,
    };
    nemSdk.crypto.helpers.passwordToPrivatekey(common, keyObject, 'pass:bip32');
    return common.privateKey;
  }

  public generateAddressQRText(): string {
    const address = new Address(this.address);
    return new QRService().generateAddressQRText(address);
  }

  public getAssetDivisibility(namespace: string, name: string): Observable<number> {
    return this.nem.getAssetDivisibility(namespace, name);
  }

  public getAllTransactionsPaginated(): Pageable<Transaction[]> {
    return this.nem.getAllTransactionsPaginated(this.address);
  }

  public getBalance(): Observable<number> {
    return this.nem.getAccountInfoWithMetaData(this.address).pipe(
      map((data) => data.balance.balance / this.nem.getDivisibility()),
    );
  }

  public getDivisibility(): number {
    return this.nem.getDivisibility();
  }

  public send(key: string, parameters: SendParameters): Observable<NemAnnounceResult> {
    const account = Account.createWithPrivateKey(key);
    return this.nem.send(account, parameters);
  }
}
