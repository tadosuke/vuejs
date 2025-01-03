export default {
  name: 'NumberSlider',
  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    variation: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  data() {
    return {
      currentValue: this.min,

      // ウィジェット全体のスタイル
      numericsliderStyle: {
        display: 'flex',
        alignItems: 'center', // 縦方向に中央揃え
      },

      // 数値ボックスのスタイル
      numberStyle: {
        marginRight: '5px',
        width: '50px',
      },

      // スライダーのスタイル
      rangeStyle: {
      },      
    };
  },
  methods: {
    updateValue(event) {
      let value = event.target.value;

      // 空入力や非数値は許可しない
      if (value === '' || isNaN(value)) {
        event.target.value = this.currentValue; // 現在の値に戻す
        return;
      }

      // 値を数値に変換し、範囲内に制限
      value = parseFloat(value);
      value = Math.min(Math.max(value, this.min), this.max);

      // 刻みに従った値に丸める
      value = Math.round(value / this.variation) * this.variation;

      // 更新と修正された値の再適用
      this.currentValue = value;
      event.target.value = value;
    },

    // 現在の値を範囲内に補正
    validateValue() {
      this.currentValue = Math.min(Math.max(this.currentValue, this.min), this.max);
      this.currentValue = Math.round(this.currentValue / this.variation) * this.variation;
    },
  },
  template: `
    <div class="numericslider" :style="numericsliderStyle">
      <input
        type="number"
        :min="min"
        :max="max"
        :step="variation"
        :value="currentValue"
        @input="updateValue"
        @blur="validateValue"
        class="numericslider_number"
        :style="numberStyle"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        :step="variation"
        v-model.number="currentValue"
        class="numericslider_range"
        :style="rangeStyle"
      />
    </div>
  `,
};
