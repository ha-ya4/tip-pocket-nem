import nem from 'nem-sdk';

const NODE_LIST: string[] = [
  '176.9.68.110',
  '108.61.182.27',
  '104.238.161.61',
  '185.122.58.130',
  'nempragt5.manitpro.be',
  '103.207.68.57',
  'asia.manitpro.be',
  'rabanne.manitpro.be',
  '160.16.147.251',
  '95.169.14.208',
  '153.122.85.177',
  '153.122.13.99',
  '110.44.135.87',
  '153.122.13.35',
];


interface NemAccount {
  address: string;
  privateKey: string;
}

export default class Nem {
  private endpoint: string;
  private node: string;
  private port: string = process.env.NEM_PORT;
  private net: number = process.env.NEM_MAIN_NET;

  constructor() {
    const index = Math.floor(Math.random() * 11);
    this.node = NODE_LIST[index];

    this.endpoint = nem.model.objects.create('endpoint')(this.node, this.port);
  }

  // アカウント作成
  public createAccount(name: string, pass: string): NemAccount {
    const walletName = name;
    const password = pass;
    const wallet = nem.model.wallet.createPRNG(walletName, password, this.net);
    const common = nem.model.objects.create('common')(password, '');
    const account = wallet.accounts[0];
    nem.crypto.helpers.passwordToPrivatekey(common, account, account.algo);

    return {
      address: account.address,
      privateKey: common.privateKey,
    };
  }

  public async getAccount(address: string) {
    return await nem.com.requests.account.data(this.endpoint, address);
  }

  public async send(address: string, privateKey: string, amount: number, message: string) {
    const common = nem.model.objects.create('common')('', privateKey);
    const transferTransaction = nem.model
                                   .objects
                                   .create('transferTransaction')(address, amount, message);
    const transactionEntity = nem.model
                                 .transactions
                                 .prepare('transferTransaction')(common, transferTransaction, this.net);

    return await nem.model.transactions.send(common, transactionEntity, this.endpoint);
  }
}
