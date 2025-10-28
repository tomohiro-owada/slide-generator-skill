# スライド生成スキル

このスキルは、HTML、CSS、SVGロゴを使ったプレゼンテーションスライドを生成します。

## 基本的な使い方

**ユーザーはスライドの内容を貼り付けるだけで、全自動でスライドが完成します。**

1. ユーザーがスライドにしたい内容（テキスト、データ、コードなど）を提供
2. Claude Codeが自動的に内容を分析・最適なレイアウトを選択・分割
3. Markdownファイルを作成
4. `generate-slides.js`でHTMLに変換
5. `prepare-presentation.sh`でデプロイ（サムネイル自動生成含む）
6. Chrome DevTools MCPまたはブラウザで確認して完成！

**重要**: スタイルを修正した場合は`prepare-presentation.sh`を再実行してください。

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

## ⚠️ 重要な注意事項（必読）

### 正しいビルドワークフロー

**必ずこの順序で実行すること**:

```bash
# 1. Markdownからスライド生成
node .claude/skills/slide-generator/scripts/generate-slides.js input.md output.html

# 2. プレゼンテーション準備（サムネイル生成含む）
bash .claude/skills/slide-generator/scripts/prepare-presentation.sh output.html slide-name

# 3. ブラウザで確認
open .claude/skills/slide-generator/deploy/slide-name/index.html
```

**重要**:
- プロジェクトルートから実行する
- prepare-presentation.shがリソースをdeploy/にコピーし、パスを置換する
- スタイル修正後は必ずprepare-presentation.shを再実行

### スタイル修正時の注意

`resources/styles.css`を修正した場合：
1. 修正を保存
2. **必ず**`prepare-presentation.sh`を再実行してdeployディレクトリに反映
3. ブラウザで確認する際は強制リロード（Cmd+Shift+R）

### 検証方法

**Chrome DevTools MCPを使用**:
- スライド表示の確認
- 実際の幅・色の測定
- CSSの適用状況確認

**よくある問題**:
- ブラウザキャッシュでスタイル変更が反映されない → 強制リロード
- パスエラー → プロジェクトルートから実行しているか確認

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

5. **スライド生成とデプロイ**:
   ```bash
   # Markdownからスライド生成
   node .claude/skills/slide-generator/scripts/generate-slides.js presentation.md presentation.html

   # プレゼンテーション準備（サムネイル生成含む）
   bash .claude/skills/slide-generator/scripts/prepare-presentation.sh presentation.html my-presentation
   ```

   これで以下が自動実行される：
   - HTMLファイルの生成
   - deploy/my-presentation/にコピー
   - リソース（CSS、JS）のコピーとパス置換
   - Puppeteerによるサムネイル自動生成

6. **確認**:
   ```bash
   open .claude/skills/slide-generator/deploy/my-presentation/index.html
   ```

   またはChrome DevTools MCPで確認

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

## サムネイル生成（自動）

**prepare-presentation.shが自動的に実行します**

サムネイル生成は`prepare-presentation.sh`スクリプト内で自動的に行われます。

### 実行内容

`prepare-presentation.sh`実行時に自動的に：
1. Puppeteerの自動インストール（初回のみ）
2. リソースファイルのコピー
3. 各スライドのスクリーンショット撮影
4. `deploy/slide-name/thumbnails/index/`に保存

### 生成されるファイル

```
.claude/skills/slide-generator/deploy/
└── slide-name/
    ├── index.html
    ├── thumbnails/
    │   └── index/
    │       ├── slide-0.png
    │       ├── slide-1.png
    │       └── ...
    └── resources/  # 自動コピーされる
        ├── styles.css
        ├── script.js
        └── vendor/
```

### 再生成が必要なタイミング

以下の場合はprepare-presentation.shを再実行：
- スライドの内容を変更した後
- 新しいスライドを追加・削除した後
- レイアウトやスタイルを変更した後

```bash
bash .claude/skills/slide-generator/scripts/prepare-presentation.sh output.html slide-name
```

## スライド生成の例

### 例1: テキストを貼り付けるだけ

**ユーザー**: 「このテキストでスライド作って」+ 長文テキスト

**Claude Code**:
1. Markdownファイルを作成（presentation.md）
2. generate-slides.jsでHTMLに変換
3. prepare-presentation.shでデプロイ準備
4. Chrome DevTools MCPまたはブラウザで確認

### 例2: データでグラフスライドを作成

**ユーザー**: 「2023年の売上データ: Q1=100万, Q2=150万, Q3=120万, Q4=180万」

**Claude Code**:
1. Chart.js形式のデータを埋め込んだMarkdownを作成
2. generate-slides.jsでHTMLに変換
3. prepare-presentation.shでデプロイ準備
4. グラフが正しく表示されるか確認

### 例3: コードを含むスライド

**ユーザー**: 「このコードを説明するスライド作って」+ コードブロック

**Claude Code**:
1. コードブロックを含むMarkdownを作成
2. generate-slides.jsでシンタックスハイライト対応HTMLに変換
3. prepare-presentation.shでデプロイ準備
4. コードが正しく表示されるか確認

---

## トラブルシューティング

### スタイルが反映されない

**症状**: CSSを修正したが見た目が変わらない

**解決方法**:
1. prepare-presentation.shを再実行（deployディレクトリに反映）
2. ブラウザで強制リロード（Cmd+Shift+R）
3. Chrome DevTools MCPでCSSの読み込み状況を確認

### スライドが空になる

**症状**: 特定のスライドの内容が表示されない

**原因**: generate-slides.jsのfrontmatter分割ロジックの問題

**確認方法**: Markdownファイルの`---`の使い方を確認
- frontmatter: `---\nlayout: xxx\n---\n`
- スライド区切り: `---\n`（frontmatter後の最初の`---`は次のスライドの開始）

### パスエラー

**症状**: ファイルが見つからないエラー

**解決方法**: プロジェクトルートから実行しているか確認
```bash
pwd  # 現在地確認
# /Users/.../claude-slide-template であるべき
```
