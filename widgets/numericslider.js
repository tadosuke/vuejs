/**
 * 数値の直接入力が可能なスライダーコンポーネント
 * 
 * @component
 * @example
 * <NumberSlider :min="0" :max="100" :step="50" />
 */
export default {
  name: 'NumberSlider',

  props: {
    // 最小値
    min: {
      type: Number,
      default: 0,
    },

    // 最大値
    max: {
      type: Number,
      default: 100,
    },

    // 現在の値
    value: {
      type: Number,
      default: 0,
    },

    // 値の変化量
    step: {
      type: Number,
      required: false,
      default: 1,
    },
  },

  data() {
    return {
      currentValue: this.value,

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
    // 値を更新する
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
      value = Math.round(value / this.step) * this.step;

      // 更新と修正された値の再適用
      this.currentValue = value;
      event.target.value = value;
    },

    // 現在の値を範囲内に補正
    validateValue() {
      this.currentValue = Math.min(Math.max(this.currentValue, this.min), this.max);
      this.currentValue = Math.round(this.currentValue / this.step) * this.step;
    },
  },

  template: `
    <div class="numericslider" :style="numericsliderStyle">
      <input
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :value="currentValue"
        @input="updateValue"
        @blur="validateValue"
        class="numericslider-number"
        :style="numberStyle"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="currentValue"
        class="numericslider-range"
        :style="rangeStyle"
      />
    </div>
  `,
};
