// vuex.store.stateに対応する設定値
export interface TypeConfigData {
  amount: object;
  defaultAmount: string;
  message: object;
  defaultMessage: string;
  sendButton: boolean;
}

// vuex.store.stateのamount,messageの値を書き換えるときに渡すペイロード
export interface RegisterPayLoad {
  position: string;
  value: string;
}

// RadioButtonGroupに渡すアイテム
export interface ReceivedItems {
  value1: string;
  value2: string;
  value3: string;
}
