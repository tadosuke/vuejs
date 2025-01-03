export default {
    data() {
      return {
        canvasWidth: 320, // キャンバスの幅
        canvasHeight: 320, // キャンバスの高さ
        currentColor: "#000000", // 現在の描画色（初期値は黒）
        isDrawing: false, // マウスが押されているかどうか
        ctx: null, // Canvasの2Dコンテキスト
        cellSize: 16 // ドットの1マスのサイズ
      };
    },

    // Vueインスタンスがマウントされた後に実行
    mounted() {
      const canvas = this.$refs.canvas;
      this.ctx = canvas.getContext("2d"); // Canvasの2Dコンテキストを取得
      this.clearCanvas(); // キャンバスを初期化
    },

    methods: {
      // 描画を開始する（マウスが押されたとき）
      startDrawing(event) {
        this.isDrawing = true;
        this.draw(event); // 最初のドットを描画
      },

      // マウスを動かしたときにドットを描画
      draw(event) {          
        if (!this.isDrawing) return; // マウスが押されていない場合は何もしない
        const rect = this.$refs.canvas.getBoundingClientRect(); // キャンバスの位置を取得
        const x = Math.floor((event.clientX - rect.left) / this.cellSize) * this.cellSize; // ドットのX座標
        const y = Math.floor((event.clientY - rect.top) / this.cellSize) * this.cellSize; // ドットのY座標
        this.ctx.fillStyle = this.currentColor; // 選択された色で塗りつぶす
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize); // ドットを描画
      },

      // 描画を終了する（マウスを離したとき）
      stopDrawing() {
        this.isDrawing = false;
      },

      // キャンバスを白で塗りつぶし、グリッドを再描画
      clearCanvas() {          
        this.ctx.fillStyle = "#FFFFFF"; // 背景色を白に設定
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight); // 背景を塗りつぶす
      },

      // キャンバスの内容をPNG画像として保存
      saveAsPng() {
        const link = document.createElement("a"); // ダウンロードリンクを作成
        link.download = "dot-art.png"; // 保存ファイル名
        link.href = this.$refs.canvas.toDataURL("image/png"); // キャンバスを画像データURLに変換
        link.click(); // リンクをクリックしてダウンロードを開始
      }
    },

    template: `
      <div class="controls">
        <!-- 色を選択するためのカラーピッカー -->
        <input type="color" v-model="currentColor">

        <!-- キャンバスをクリアするボタン -->
        <button @click="clearCanvas">クリア</button>

        <!-- PNG形式で保存するボタン -->
        <button @click="saveAsPng">保存</button>
      </div>

      <!-- キャンバスエリア -->
      <canvas 
        ref="canvas" 
        :width="canvasWidth" 
        :height="canvasHeight" 
        @mousedown="startDrawing" 
        @mousemove="draw" 
        @mouseup="stopDrawing" 
        @mouseleave="stopDrawing">
      </canvas>`
  }
  