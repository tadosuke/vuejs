export default {
  name: 'DialWidget',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    color: {
      type: String,
      default: '#00ff00',  // デフォルト色を緑に設定
    },    
  },
  data() {
    return {
      currentValue: this.value,
      isDragging: false,
      startAngle: 0,
      currentAngle: 0,
    };
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue;
      this.drawDial();
    },
    color(newColor) {
      this.drawDial();  // colorが変更されたときにも描画を更新
    },
  },
  
  methods: {
    startDrag(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      // タッチまたはマウスのクリック位置
      const posX = event.clientX || event.touches[0].clientX;
      const posY = event.clientY || event.touches[0].clientY;
  
      // ダイヤルの上半分内かどうかをチェック
      const distanceFromCenter = Math.sqrt(Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2));
      if (distanceFromCenter <= rect.width / 2 && posY <= centerY) {
        this.isDragging = true;
        this.startAngle = this.getAngle(event);
        event.preventDefault();
      }
    },
    stopDrag() {
      this.isDragging = false;
    },
    onDrag(event) {
      if (!this.isDragging) return;

      const rect = this.$refs.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      // ダイヤルの上半分内かどうかをチェック
      const posX = event.clientX || event.touches[0].clientX;
      const posY = event.clientY || event.touches[0].clientY;
      const distanceFromCenter = Math.sqrt(Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2));
  
      // カーソルが円の上半分内であればドラッグを続け、それ以外は処理しない
      if (distanceFromCenter <= rect.width / 2 && posY <= centerY) {
        const angle = this.getAngle(event);
        const delta = this.calculateDelta(angle);
        this.updateValue(delta);
      }
    },
    getAngle(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
  
      // X軸の位置を反転させる
      const angle = Math.atan2(event.clientY - centerY, centerX - event.clientX);  // 反転部分
      let degrees = angle * (180 / Math.PI);
  
      // -180° から 180° の範囲に調整
      if (degrees < -180) degrees += 360;
      if (degrees > 180) degrees -= 360;
  
      return degrees;
    },
    calculateDelta(angle) {
      let delta = angle - this.startAngle;
  
      // 角度が180度を超えた場合の修正
      if (delta > 180) {
        delta -= 360;
      } else if (delta < -180) {
        delta += 360;
      }
  
      this.startAngle = angle;
      return delta;
    },    
    updateValue(delta) {
      const range = this.max - this.min;
      const anglePerUnit = 180 / range;
  
      // 新しい値を計算
      let newValue = this.currentValue - delta / anglePerUnit;
  
      // 値が min より小さくならないように制限
      newValue = Math.max(this.min, newValue);
  
      // 値が max より大きくならないように制限
      newValue = Math.min(this.max, newValue);
  
      // もし newValue が currentValue と異なる場合のみ再描画
      if (newValue !== this.currentValue) {
        this.currentValue = newValue;
        this.$emit('update:value', newValue);
        this.drawDial();
      }
    },
    drawDial() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      const radius = canvas.width / 2;
      const startAngle = Math.PI;  // 180° (左端)
      const endAngle = 2 * Math.PI;  // 360° (右端)

      // 現在の角度を計算
      const currentAngle = Math.PI + (this.currentValue - this.min) * (Math.PI / (this.max - this.min));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 下半分の背景アークを描画
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 10, startAngle, endAngle);
      ctx.fillStyle = '#ddd';
      ctx.fill();

      // 現在の値を示す進行状況アークを描画
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 10, startAngle, currentAngle, false);
      ctx.lineWidth = 10;
      ctx.strokeStyle = this.color;  // 進行状況アークの色を変更
      ctx.stroke();

      // ダイヤルポインターを描画
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(radius + Math.cos(currentAngle) * (radius - 20), radius + Math.sin(currentAngle) * (radius - 20));
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // 中央に現在の値を描画
      ctx.font = '20px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(this.currentValue), radius, radius);
    },
  },
  mounted() {
    this.drawDial();
  },
  template: `
    <div
      class="dial-widget"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="stopDrag"
      @touchcancel="stopDrag"
    >
      <canvas ref="canvas" width="200" height="110"></canvas>
    </div>
  `,
};
