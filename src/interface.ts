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

export interface Message {
  id: number;
  name: string;
  content: MessageContent;
}

interface MessageContent {
  message: string;
  color: string
}


