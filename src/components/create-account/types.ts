import { TypeConfigData } from '../../interface';

export enum CreateAcountPages {
  CreateMethod = 0,
  NewAccount,
  ImportPrivateKey,
}

export class AccountData {
  constructor(
    private configData: TypeConfigData,
    private accountData: {
      address: string,
      publicKey: string,
    },
  ) {}
}
