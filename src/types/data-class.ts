import { PlainMessage, EncryptedMessage } from 'nem-library';

import { Result } from '@/types/enum';
import { TypeConfigData } from '@/interface';

export class AccountData {
  constructor(
    private configData: TypeConfigData,
    private accountData: { address: string, publicKey: string },
  ) {}
}

export class InformationData {
  constructor(
    public color: string,
    public result: Result,
    public message: string,
  ) {}
}

export class SendParameters {
  constructor(
    public amount: number,
    public message: PlainMessage | EncryptedMessage,
    public receiverAddress: string,
  ) {}
}
