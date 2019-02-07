export default class DataStorage {
  private storageName: string;

  constructor(storageName: string) {
    this.storageName = storageName;
  }

  get getData(): object | null {
    const item = localStorage.getItem(this.storageName);
    if (item !== null) {
      return JSON.parse(item);
    } else {
      return null;
    }
  }

  set setData(data: object) {
    const configData = JSON.stringify(data);
    localStorage.setItem(this.storageName, configData);
  }

  public removeData() {
    localStorage.removeItem(this.storageName);
  }
}
