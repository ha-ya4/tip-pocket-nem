// vuex.store.stateに対応する設定値
export interface TypeConfigData {
  amount: RadioGroupValue;
  message: RadioGroupValue;
  sendButton: boolean;
  amountLimit: number;
}

export interface RadioGroupValue {
  value: string | number;
  defaultValue: boolean;
}

export interface InformationMessage {
  name: string;
  message: string;
  color: string;
}
