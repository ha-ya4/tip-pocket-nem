export default {
  namespaced: true,

  state: {
    amount: {
      amount1: 0,
      amount2: 10,
      amount3: 100,
    },

    defaultAmount: 'amount1',

    message: {
      message1: '',
      message2: '',
      message3: '',
    },

    defaultMessage: 'message1',

    // 送金時に確認するかどうか
    confirm: true,
  },

  getters: {
    defaultAmount(state: any): number {
      // デフォルトに設定しているkey名を取得
      const defaultAmountName = state.defaultAmount;
      // key名でデフオルト値を取得して返す
      return state.amount[defaultAmountName];
    },

    defaultMessage(state: any): string {
      // デフォルトに設定しているkey名を取得
      const defaultMessageName = state.defaultMessage;
       // key名でデフオルトメッセージを取得して返す
      return state.message[defaultMessageName];
    },
  },

  mutations: {
    // confirmをtrueならfalse、またはその逆に書き換える
    changeConfirm(state: any) {
      if (state.confirm === true) {
        state.confirm = false;
      } else {
        state.confirm = true;
      }
    },

    // 指定したkey名の値を書き換える
    // 連想配列の型はインターフェースで定義してあるがこれでいいのか？
    registerAmount(state: any, payload: AmountRegisterPayLoad) {
      state.amount[payload.position] = payload.amount;
    },

    // 指定したkey名のメッセージを書き換える
    registerMessage(state: any, payload: MessageRegisterPayLoad) {
      state.message[payload.position] = payload.message;
    },
  },

  actions: {},
};

// 数量を書き換えるときに渡す引数の型
interface registerAmountPayLoad {
  position: string;
  amount: number;
}

// メッセージを書き換えるときに渡す引数の型
interface registerMessagePayLoad {
  position: string;
  message: string;
}
