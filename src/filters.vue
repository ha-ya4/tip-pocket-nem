<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  filters: {
    fDateTime(value: any): string {
      const date = value._date;
      const time = value._time;
      const dateTime = `${date._year}-${date._month}-${date._day}/${time._hour}:${time._minute}`;
      return dateTime;
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
