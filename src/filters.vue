<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Account, EncryptedMessage, PlainMessage, PublicAccount } from 'nem-library';
import nemSdk from 'nem-sdk';

import LocalStorage from '@/class/local-storage';
import Wallet from '@/class/wallet.ts';

@Component({
  filters: {
    fDateTime(value: any): string {
      const date = value._date;
      const time = value._time;
      const dateTime = `${date._year}-${date._month}-${date._day}/${time._hour}:${time._minute}`;
      return dateTime;
    },

    fGetMessage(
      message: PlainMessage | EncryptedMessage,
      recipientPublicAccount: PublicAccount,
      wallet: Wallet,
    ): string {
      // 暗号化されてなければそのまま返す
      if (message.isPlain()) {
        const mess = message as PlainMessage;
        return mess.plain();
      }

      // 暗号化されていたらencryptoする。毎回createWithPrivateKeyを呼ぶことになってしまってる
      const storageName = wallet.walletName;
      const encryptedKey = LocalStorage.getKey(storageName);
      if (encryptedKey) {
        const key = wallet.decrypto(encryptedKey);
        const account = Account.createWithPrivateKey(key);
        return account.decryptMessage(message, recipientPublicAccount).plain();
      }

      return '';
    },

    // ５文字ごとに-を入れる
    fInsertHyphen(str: string): string {
      let s = '';
      for (let x = 0; x < str.length; x += 5) {
        s = s + str.slice(x, x + 5) + '-';
      }
      return s.slice(0, -1);
    },

    fAddOperator(quantity: number, isSender: boolean): string {
      const q = quantity.toString();
      if (isSender) {
        return '-' + q;
      } else {
        return '+' + q;
      }
    },

    fStringShort(str: string): string {
      const length = 35;
      if (length < str.length) {
        return str.substr(0, length) + '...';
      }
      return str;
    },
  },
})
export default class Filters extends Vue {}
</script>
