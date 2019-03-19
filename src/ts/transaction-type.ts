import {
  EncryptedMessage,
  MultisigTransaction,
  PlainMessage,
  PublicAccount,
  TimeWindow,
  TransferTransaction,
} from 'nem-library';

// transaction部分をひとまずany。どうしたらうまくできるのかわかんない。
export function genarateTransactionType(transaction: any): TransactionInterface {
  if (transaction.otherTransaction) {
    return new Multisig(TransactionType.Multisig, transaction);
  }

  return new Transfer(TransactionType.Transfer, transaction);
}

export interface TransactionInterface {
  transactionType: TransactionType;

  timeWindow(): TimeWindow;
  type(): string;
  height(): number;
  hash(): string;
  sender(): string | null;
  recipient(): string;
  publicAccount(): PublicAccount;
  quantity(): number;
  fee(): number;
  message(): PlainMessage | EncryptedMessage;
}

enum TransactionType {
  Transfer = 'TransferTransaction',
  Multisig = 'MultisigTransaction',
}

class AppTransaction {
  constructor(
    public transactionType: TransactionType,
    protected transaction: any,
  ) {}

  public timeWindow(): TimeWindow { return this.transaction.timeWindow; }

  public type(): string { return this.transactionType; }

  public height(): number { return this.transaction.getTransactionInfo().height; }

  public hash(): string { return this.transaction.getTransactionInfo().hash.data; }

  public sender(): string | null {
    if (!this.transaction.signer) { return null; }
    return this.transaction.signer.address.pretty();
  }

  public recipient(): string {  return this.transaction.recipient.pretty(); }

  public publicAccount(): PublicAccount { return this.transaction.signer; }

  public quantity(): number { return this.transaction.xem().quantity; }

  public fee(): number { return this.transaction.fee; }

  public message(): PlainMessage | EncryptedMessage { return this.transaction.message; }
}

export class Transfer extends AppTransaction implements TransactionInterface {
  constructor(transactionType: TransactionType, transaction: TransferTransaction) {
    super(transactionType, transaction);
  }
}

export class Multisig  extends AppTransaction implements TransactionInterface {
  constructor(transactionType: TransactionType, transaction: MultisigTransaction) {
    super(transactionType, transaction);
  }

  public recipient(): string {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.recipient.pretty();
  }

  public publicAccount(): PublicAccount { return this.transaction.otherTransaction.signer; }

  public quantity(): number {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.xem().quantity;
  }

  public message(): PlainMessage | EncryptedMessage {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.message;
   }
}
