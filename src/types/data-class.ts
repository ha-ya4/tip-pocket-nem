import { PlainMessage, EncryptedMessage } from 'nem-library';

import { Result } from '../types/enum';

export class AccountData {
  constructor(
    private configData: ConfigData,
    private accountData: { address: string, publicKey: string },
  ) {}
}

export class ConfigData {
  constructor(
    public amount: ConfigValue[],
    public message: ConfigValue[],
    public sendButton: boolean,
    public amountLimit: number,
  ) {}
}

export class ConfigValue {
  constructor(
    public value: string | number,
    public defaultValue: boolean,
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
