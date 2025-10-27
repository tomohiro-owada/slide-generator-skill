# スライド生成スキル

このスキルは、HTML、CSS、SVGロゴを使ったプレゼンテーションスライドを生成します。

## 基本的な使い方

**ユーザーはスライドの内容を貼り付けるだけで、全自動でスライドが完成します。**

1. ユーザーがスライドにしたい内容（テキスト、データ、コードなど）を提供
2. Claude Codeが自動的に内容を分析・最適なレイアウトを選択・分割
3. HTMLファイルを生成して保存
4. ユーザーが `./generate-thumbnails.sh` を実行してサムネイル生成
5. ブラウザで開いて完成！

**重要**: 生成後は必ず `./generate-thumbnails.sh` を実行してください。プログレスバーのサムネイルプレビュー機能が使えるようになります。

## リソースファイル

このスキルには以下のリソースが含まれています：

### 1. HTMLテンプレート
- `resources/template.html` - シンプルなスライドの基本構造
- `resources/layouts-example.html` - 全レイアウトのサンプル集（18スライド）

### 2. CSSスタイル
`resources/styles.css` - すべてのレイアウト用スタイル定義

### 3. SVGロゴ
`resources/logo.svg` - タイトルスライドに表示されるロゴ

### 4. レイアウト仕様書
`resources/layout-specs.md` - 各レイアウトの項目数、文字数制限、推奨内容

### 5. 内容テンプレート
`resources/content-template.md` - スライド内容を記述するためのMarkdownテンプレート

## ワークフロー

### デフォルト: 全自動生成（推奨）

**これが基本のワークフローです。ユーザーは内容を貼り付けるだけでOK。**

ユーザーがテキスト、データ、コードなどを提供したら、以下を自動で実行：

1. **内容分析**:
   - テキスト全体を読み込んで構造を理解
   - トピックごとにセクション分け
   - 重要度を判断

2. **自動分割**:
   - `resources/layout-specs.md`の文字数制限を参照
   - 各レイアウトの推奨文字数に収まるよう分割
   - 1スライドに収まらない情報は複数スライドに分割

3. **レイアウト自動選択**:
   - 内容の性質に応じて最適なレイアウトを選択
   - リスト → 箇条書きスライド
   - 比較内容 → 2カラムスライドまたはテーブル
   - 数値データ → グラフスライド
   - 重要な一文 → ワンラインテキスト or 引用スライド
   - Before/After → 差分確認スライド
   - コード → コードスライド

4. **スライド構成提案**:
   - タイトルスライドを先頭に追加
   - トピックが変わる箇所にセクション区切りを挿入
   - 終了スライドを最後に追加
   - 全体の流れを確認

5. **ファイル生成**:
   - HTMLファイルを生成して保存（プロジェクトルートに `presentation.html` など）
   - 必要なリソースは相対パスで参照（自動設定済み）
   - Chart.js、Prism.jsは `slide-generator/resources/vendor/` から読み込み

6. **サムネイル生成指示**:
   - ユーザーに `./generate-thumbnails.sh` の実行を促す
   - このスクリプトが自動的に：
     - 必要なライブラリ（Chart.js、Prism.jsなど）をダウンロード
     - Puppeteerをインストール
     - 各スライドのサムネイルを生成

**分割の目安:**
- 箇条書き: 5項目以上 → 複数スライドに分割
- 段落テキスト: 300文字以上 → 複数スライドまたは要約
- データ: 8データポイント以上 → 複数グラフに分割
- コード: 15行以上 → 重要部分のみ抽出or複数スライド

### その他の方法

**Markdownファイルがある場合**:
- ユーザーがMarkdownファイルを提供したら、それを読み込んで上記のワークフローを実行

**対話的に作成する場合**:
- ユーザーが要件を口頭で伝える場合は、内容を確認しながら段階的に生成

## 利用可能なレイアウト

### 1. タイトルスライド（title-slide）
最初のスライドに使用。ロゴ、タイトル、サブタイトルを含む。

```html
<section class="slide title-slide">
    <div class="logo-container">
        <img src="logo.svg" alt="Logo" class="logo">
    </div>
    <h1>タイトル</h1>
    <p class="subtitle">サブタイトル</p>
</section>
```

### 2. 箇条書きスライド（デフォルト）
一般的な箇条書きリスト。

```html
<section class="slide">
    <h2>見出し</h2>
    <ul>
        <li>ポイント1</li>
        <li>ポイント2</li>
        <li>ポイント3</li>
    </ul>
</section>
```

### 3. 2カラムスライド（two-column）
左右に内容を分割表示。比較や対比に最適。

```html
<section class="slide two-column">
    <div class="column">
        <h2>左側</h2>
        <p>内容...</p>
    </div>
    <div class="column">
        <h2>右側</h2>
        <p>内容...</p>
    </div>
</section>
```

### 4. 画像中心スライド（image-center）
画像を中心に配置し、説明を追加。

```html
<section class="slide image-center">
    <h2>見出し</h2>
    <img src="image.jpg" alt="説明">
    <p>キャプション</p>
</section>
```

### 5. 引用スライド（quote-slide）
重要な引用や印象的なメッセージを大きく表示。

```html
<section class="slide quote-slide">
    <blockquote>
        引用文...
    </blockquote>
    <cite>— 引用元</cite>
</section>
```

### 6. セクション区切りスライド（section-slide）
章やセクションの区切りに使用。

```html
<section class="slide section-slide">
    <h2>第2章</h2>
    <p>セクションの説明</p>
</section>
```

### 7. テーブルスライド（table-slide）
データや比較表の表示。

```html
<section class="slide table-slide">
    <h2>比較表</h2>
    <table>
        <thead>
            <tr><th>項目</th><th>A</th><th>B</th></tr>
        </thead>
        <tbody>
            <tr><td>価格</td><td>100</td><td>200</td></tr>
        </tbody>
    </table>
</section>
```

### 8. コードスライド（code-slide）
ソースコードの表示に最適。

```html
<section class="slide code-slide">
    <h2>コードサンプル</h2>
    <pre><code>function example() {
    return "Hello";
}</code></pre>
</section>
```

### 9. フルサイズ画像背景スライド（full-image）
背景画像全体にテキストを重ねる。

```html
<section class="slide full-image" style="background-image: url('bg.jpg');">
    <div class="content">
        <h2>メッセージ</h2>
        <p>説明</p>
    </div>
</section>
```

### 10. 終了スライド（ending-slide）
プレゼンテーションの最後に使用。

```html
<section class="slide ending-slide">
    <h2>ありがとうございました</h2>
    <p>ご清聴ありがとうございました</p>
    <div class="contact">
        <p>contact@example.com</p>
    </div>
</section>
```

### 11. グラフスライド（chart-slide）
Chart.jsを使ったグラフを1つ表示。棒グラフ、折れ線グラフ、円グラフなど。

```html
<section class="slide chart-slide">
    <h2>売上推移</h2>
    <div class="chart-container">
        <canvas id="myChart"></canvas>
    </div>
</section>
```

**注意**: HTMLの`<head>`にChart.jsのCDNを追加する必要があります：
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### 12. 2つのグラフ並列（dual-chart-slide）
2つのグラフを左右に並べて表示。

```html
<section class="slide dual-chart-slide">
    <h2>データ分析</h2>
    <div class="chart-wrapper">
        <h3>市場シェア</h3>
        <div class="chart-container">
            <canvas id="chart1"></canvas>
        </div>
    </div>
    <div class="chart-wrapper">
        <h3>成長率</h3>
        <div class="chart-container">
            <canvas id="chart2"></canvas>
        </div>
    </div>
</section>
```

### 13. グラフ+テキスト並列（chart-text-slide）
グラフと説明テキストを並べて表示。

```html
<section class="slide chart-text-slide">
    <div class="chart-section">
        <div class="chart-container">
            <canvas id="chart"></canvas>
        </div>
    </div>
    <div class="text-section">
        <h2>主要な発見</h2>
        <ul>
            <li>ポイント1</li>
            <li>ポイント2</li>
        </ul>
        <p>説明文...</p>
    </div>
</section>
```

## グラフの初期化

グラフを使用する場合は、`<script>`タグ内でChart.jsの初期化が必要です。サンプルは`resources/layouts-example.html`を参照してください。

### 14. 差分確認スライド（diff-slide）
Before/After比較やコード差分を左右に並べて表示。

**テキスト比較の例:**
```html
<section class="slide diff-slide">
    <h2>改善ポイント</h2>
    <div class="diff-container">
        <div class="diff-panel before">
            <h3>Before</h3>
            <div class="diff-content">
                <ul>
                    <li>問題点1</li>
                    <li>問題点2</li>
                </ul>
            </div>
        </div>
        <div class="diff-panel after">
            <h3>After</h3>
            <div class="diff-content">
                <ul>
                    <li>改善点1</li>
                    <li>改善点2</li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

**コード比較の例:**
```html
<section class="slide diff-slide">
    <h2>リファクタリング</h2>
    <div class="diff-container">
        <div class="diff-panel before">
            <h3>Before</h3>
            <div class="diff-content">
                <pre><code>古いコード...</code></pre>
            </div>
        </div>
        <div class="diff-panel after">
            <h3>After</h3>
            <div class="diff-content">
                <pre><code>新しいコード...</code></pre>
            </div>
        </div>
    </div>
</section>
```

### 15. ワンラインテキストオンリー（oneline-slide）
シンプルで大きな1行メッセージを表示。インパクト重視。

**基本形:**
```html
<section class="slide oneline-slide">
    <div class="message">
        Think Different
    </div>
</section>
```

**サブメッセージ付き:**
```html
<section class="slide oneline-slide">
    <div class="message medium">
        メインメッセージ
    </div>
    <p class="submessage">サブメッセージ</p>
</section>
```

**サイズバリエーション:**
- デフォルト（6rem）: `class="message"`
- 中サイズ（5rem）: `class="message medium"`
- 小サイズ（4rem）: `class="message small"`

## 操作方法

生成されたスライドは以下のキーで操作：
- `→` (右矢印): 次のスライド
- `←` (左矢印): 前のスライド
- `Home`: 最初のスライドへ
- `End`: 最後のスライドへ
- URLクエリパラメータ: `?p=5` で直接5ページ目に移動

### プログレスバー機能

画面上部にセグメント化されたプログレスバーが表示されます：
- 各セグメントがスライド1枚に対応
- クリックすると該当スライドに移動
- ホバーするとサムネイルプレビューを表示

## サムネイル生成（重要）

**スライド生成後、必ずこのステップを実行してください！**

プログレスバーのサムネイルプレビュー機能を使用するには、サムネイル画像の生成が必要です。

### 実行方法（超簡単）

プロジェクトのルートディレクトリで以下のコマンドを実行するだけ：
```bash
./generate-thumbnails.sh
```

**たったこれだけで完了します！** スクリプトが自動的に：
1. Node.jsのチェック（未インストールの場合は指示を表示）
2. Puppeteerの自動インストール（初回のみ）
3. **Chart.js、Prism.js等の必要なライブラリを自動ダウンロード**
4. ヘッドレスChromeでHTMLを開く
5. 全スライドのスクリーンショットを撮影
6. `.thumbnails/` ディレクトリに保存

### 前提条件

Node.jsのみ必要です：
```bash
# macOSの場合
brew install node
```

### 生成されるファイル

```
.thumbnails/
├── presentation-name/
│   ├── slide-0.png
│   ├── slide-1.png
│   └── ...

slide-generator/resources/vendor/  # 自動ダウンロードされる
├── chart.min.js
├── chartjs-plugin-datalabels.min.js
├── prism.js
├── prism.css
└── prism-javascript.min.js
```

### 再生成が必要なタイミング

以下の場合はサムネイルを再生成してください：
- スライドの内容を変更した後
- 新しいスライドを追加・削除した後
- レイアウトやスタイルを変更した後

**再度実行するだけでOK**: `./generate-thumbnails.sh`

**注意**:
- `.thumbnails/` と `vendor/` ディレクトリは `.gitignore` に含まれています
- Gitにコミットされないため、各環境で生成が必要です
- ライブラリは既にダウンロード済みの場合はスキップされます（高速）

## スライド生成の例

### 例1: テキストを貼り付けるだけ

**ユーザー**: 「このテキストでスライド作って」+ 長文テキスト

**Claude Code**:
1. テキストを分析してトピック分け
2. 自動的にレイアウトを選択・分割
3. `presentation.html` を生成
4. 「`./generate-thumbnails.sh` を実行してください」と指示

**ユーザー**: `./generate-thumbnails.sh` を実行 → 完成！

### 例2: データでグラフスライドを作成

**ユーザー**: 「2023年の売上データ: Q1=100万, Q2=150万, Q3=120万, Q4=180万」

**Claude Code**:
1. 数値データを検出
2. Chart.jsで棒グラフを生成
3. グラフスライドとして自動レイアウト
4. HTMLを生成・保存

**ユーザー**: `./generate-thumbnails.sh` を実行 → 完成！

### 例3: コードを含むスライド

**ユーザー**: 「このコードを説明するスライド作って」+ コードブロック

**Claude Code**:
1. コードを検出してシンタックスハイライト対応
2. コードスライドレイアウトを使用
3. 説明文を追加して自動構成
4. HTMLを生成・保存

**ユーザー**: `./generate-thumbnails.sh` を実行 → 完成！

---

**重要**: 生成されたHTMLファイルは、必ず `./generate-thumbnails.sh` を実行してからブラウザで開いてください。サムネイルプレビュー機能が使えるようになります。
