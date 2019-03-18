import {
  EncryptedMessage,
  MultisigTransaction,
  PlainMessage,
  TimeWindow,
  TransferTransaction,
} from 'nem-library';

export function genarateTransactionType(transaction: any): AppTransaction {
  if (transaction.otherTransaction) {
    return new Multisig(TransactionType.Multisig, transaction);
  }

  return new Transfer(TransactionType.Transfer, transaction);
}

export interface AppTransaction {
  transactionType: TransactionType;

  timeStamp(): TimeWindow;
  height(): number;
  hash(): string;
  sender(): string | null;
  recipient(): string;
  quantity(): number;
  fee(): number;
  message(): PlainMessage | EncryptedMessage;
}

enum TransactionType {
  Transfer = 'TransferTransaction',
  Multisig = 'MultisigTransaction',
}

class Transfer implements AppTransaction {
  constructor(
    public transactionType: TransactionType,
    private transaction: TransferTransaction,
  ) {}

  public timeStamp(): TimeWindow { return this.transaction.timeWindow; }

  public height(): number { return this.transaction.getTransactionInfo().height; }

  public hash(): string { return this.transaction.getTransactionInfo().hash.data; }

  public sender(): string | null {
    if (!this.transaction.signer) { return null; }
    return this.transaction.signer.address.pretty();
  }

  public recipient(): string {  return this.transaction.recipient.pretty(); }

  public quantity(): number { return this.transaction.xem().quantity; }

  public fee(): number { return this.transaction.fee; }

  public message(): PlainMessage | EncryptedMessage { return this.transaction.message; }
}

class Multisig implements AppTransaction {
  constructor(
    public transactionType: TransactionType,
    private transaction: MultisigTransaction,
  ) {}

  public timeStamp(): TimeWindow { return this.transaction.timeWindow; }

  public height(): number { return this.transaction.getTransactionInfo().height; }

  public hash(): string { return this.transaction.getTransactionInfo().hash.data; }

  public sender(): string | null {
    if (!this.transaction.signer) { return null; }
    return this.transaction.signer.address.pretty();
  }

  public recipient(): string {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.recipient.pretty();
  }

  public quantity(): number {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.xem().quantity;
  }

  public fee(): number { return this.transaction.fee; }

  public message(): PlainMessage | EncryptedMessage {
    const transaction = this.transaction.otherTransaction as TransferTransaction;
    return transaction.message;
   }
}
