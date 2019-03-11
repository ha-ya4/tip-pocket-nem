<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PublicAccount } from 'nem-library';

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

    fGetMessage(message: any, recipientPublicAccount: PublicAccount, wallet: Wallet): string {
      const mess = message.plain();
      if (mess) {
        return mess;
      }

      const storageName = wallet.walletName;
      const keyJson = LocalStorage.getKey(storageName);
      if (keyJson) {}

      return mess
    },

    // ５文字ごとに-を入れる
    fInsertHyphen(str: string): string {
      let s = '';
      for (let x = 0; x < str.length; x += 5) {
        s = s + str.slice(x, x + 5) + '-';
      }
      return s.slice(0, -1);
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
