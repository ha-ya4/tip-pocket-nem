import {
  XEM,
  Account,
  AccountHttp,
  Address,
  SignedTransaction,
  SimpleWallet,
  Password,
  NEMLibrary,
  NetworkTypes,
  TimeWindow,
  TransferTransaction,
  TransactionHttp,
} from 'nem-library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SendParameters } from './wallet/data-class';

NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);

const accountHttpWithCustomNode: AccountHttp = new AccountHttp([
  { protocol: 'http', domain: '176.9.68.110', port: 7890 },
  { protocol: 'http', domain: '108.61.182.27', port: 7890 },
  { protocol: 'http', domain: '104.238.161.61', port: 7890 },
  { protocol: 'http', domain: '185.122.58.130', port: 7890 },
  { protocol: 'http', domain: 'nempragt5.manitpro.be', port: 7890 },
  { protocol: 'http', domain: 'asia.manitpro.be', port: 7890 },
  { protocol: 'http', domain: 'rabanne.manitpro.be', port: 7890 },
  { protocol: 'http', domain: '153.122.13.35', port: 7890 },
  { protocol: 'http', domain: '153.122.85.177', port: 7890 },
]);

export default class Nem {
  private accountHttp: AccountHttp = accountHttpWithCustomNode;
  private password: string;
  private walletName: string;

  constructor(walletName: string, password: string) {
    this.walletName = walletName;
    this.password = password;
  }
  // アカウント作成
  public createAccount(): SimpleWallet {
    const password = new Password(this.password);
    return SimpleWallet.create(this.walletName, password);
  }

  public getBalance(addr: string): Observable<number> {
    const address = new Address(addr);
    return this.accountHttp
               .getFromAddress(address)
               .pipe(
                 map((d) => d.balance.balance / this.getDivisibility())
               );
  }

  public send(account: Account, parameters: SendParameters) {
    const transferTransaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address(parameters.receiverAddress),
      new XEM(parameters.amount),
      parameters.message
    );

    const transactionHttp = new TransactionHttp();

    const signedTransaction: SignedTransaction = account.signTransaction(transferTransaction);

    transactionHttp.announceTransaction(signedTransaction).subscribe(res => {
      console.log(res)
    })
  }

  private getDivisibility(): number {
    return Math.pow(10, 6);
  }
}

