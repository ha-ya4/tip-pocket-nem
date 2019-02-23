import { PlainMessage, EncryptedMessage } from 'nem-library';

export class AccountData {
  constructor(
    public address: string,
    public iv: string,
    public privateKey: string,
    public publicKey: string,
  ) {}
}

export class SendParameters {
  constructor(
    public amount: number,
    public message: PlainMessage | EncryptedMessage,
    public receiverAddress: string,
  ) {}
}
