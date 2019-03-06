import { PlainMessage, EncryptedMessage } from 'nem-library';

export class SendParameters {
  constructor(
    public amount: number,
    public message: PlainMessage | EncryptedMessage,
    public receiverAddress: string,
  ) {}
}
