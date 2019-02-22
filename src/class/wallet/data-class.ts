import { PlainMessage, EncryptedMessage } from 'nem-library';

export interface AccountData {
  address: string;
  iv: string;
  privateKey: string;
  publicKey: string;
}

export class SendParameters {
  constructor(
    public amount: number,
    public message: PlainMessage | EncryptedMessage,
    public receiverAddress: string) {}
}