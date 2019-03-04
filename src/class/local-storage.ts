export default class LocalStorage {
  public static getKey(walletName: string): { encryptedKey: string, iv: string } | null {
    const storageName = `${walletName}-key`;
    const keyJson = localStorage.getItem(storageName);
    if (keyJson) { return JSON.parse(keyJson); }
    return null;
  }

  public static setNemAccount(walletName: string, address: string, publicKey: string ) {
    const accountDataStorageName = walletName;
    const accountDataJson = localStorage.getItem(accountDataStorageName);
    if (accountDataJson) {
      const accountData = JSON.parse(accountDataJson);
      const publicData = { address, publicKey };
      // ローカルストレージから取得したデータのaccountData部分をpublicDataで書き換える
      accountData.accountData = publicData;
      const accData = JSON.stringify(accountData);
      localStorage.setItem(accountDataStorageName, accData);
    }
  }

  public static setEncryptedKey(encryptedKey: { encryptedKey: string, iv: string }, walletName: string) {
    const key = JSON.stringify(encryptedKey);
    const keyStorageName = `${walletName}-key`;
    // key保存
    localStorage.setItem(keyStorageName, key);
  }
}
