# Slide Generator Skill

## 目的

このスキルは**スライド生成システム**を提供します。成果物は個別のスライドではなく、スライドを生成するためのツールとテンプレートシステムです。

## スキルが提供するもの

### 1. デザインシステム (Wolsey Design System)
- 一貫性のあるカラーパレット、タイポグラフィ、レイアウト
- 幾何学的装飾要素（geometric decorations）
- レスポンシブデザイン（100vw × 100vh固定）

### 2. 16種類のレイアウトテンプレート
1. タイトルスライド (title-slide)
2. 箇条書きスライド (bullet-slide)
3. 2カラムスライド (two-column)
4. 引用スライド (quote-slide)
5. 3カラムスライド (three-column)
6. フルイメージスライド (full-image)
7. エンディング/クレジットスライド (credits-slide)
8. アクセント見出しスライド
9. 画像中心スライド (image-center)
10. プロフィールスライド (profile-slide)
11. テーブルスライド (table-slide)
12. コード表示スライド (code-slide)
13. グラフスライド (chart-slide) - Chart.js統合
14. 2つのグラフ並列 (dual-chart-slide)
15. グラフ+テキスト並列 (chart-text-slide)
16. Before/After比較スライド (diff-slide)
17. ワンラインテキスト (oneline-slide)

### 3. インタラクティブ機能
- **キーボード操作**:
  - `→` / `←`: 次/前のスライド
  - `Home` / `End`: 最初/最後のスライド
  - `G`: サムネイル一覧表示トグル
  - `Esc`: サムネイル一覧を閉じる
- **プログレスバー**: 上部にセグメント型進捗表示
- **サムネイル一覧**: 全スライドのサムネイル表示とクイックナビゲーション
- **ページ番号**: 右下に現在位置表示

### 4. 技術統合
- **Chart.js**: グラフ・チャートの描画
- **Prism.js**: コードのシンタックスハイライト
- **レスポンシブCanvas**: グラフの自動リサイズ

### 5. ビルドシステム
- **generate-slides.js**: Markdownからスライド生成
- **prepare-presentation.sh**: サムネイル生成とプレゼンテーション準備
- **自動サムネイル生成**: Puppeteerを使用した各スライドのスクリーンショット

## 使い方

### スライド生成
```bash
node .claude/skills/slide-generator/generate-slides.js input.md output.html
```

### プレゼンテーション準備（サムネイル生成）
```bash
bash .claude/skills/slide-generator/prepare-presentation.sh output.html
```

### 設定ファイルから生成
```bash
node .claude/skills/slide-generator/generate-slides.js config.json
```

### デプロイ（推奨: Surge）
```bash
cd .claude/skills/slide-generator/deploy

# Surgeでデプロイ（推奨・最も簡単）
npm install -g surge  # 初回のみ
surge

# カスタムドメインを指定
surge --domain my-presentation.surge.sh
```

**デプロイオプション:**
- **Surge** (推奨): ユーザー指定がない場合のデフォルト
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: リポジトリ設定から有効化
- **Vercel**: `vercel --prod`

## ファイル構成

```
.claude/skills/slide-generator/
├── CLAUDE.md                    # このファイル（スキルの説明）
├── generate-slides.js           # スライド生成スクリプト
├── prepare-presentation.sh      # プレゼンテーション準備シェル
├── resources/
│   ├── styles.css              # メインスタイルシート（Wolseyデザインシステム）
│   ├── script.js               # インタラクティブ機能のJavaScript
│   ├── layouts-example.html    # 全レイアウトの例
│   └── vendor/                 # サードパーティライブラリ
│       ├── chart.min.js
│       ├── prism.js
│       └── ...
└── examples.md                  # 使用例
```

## 重要な原則

1. **スキルはツールを提供する**: 個別のスライドではなく、スライド生成システムを構築する
2. **テンプレートを修正する**: 成果物（生成されたHTML）ではなく、resources/配下のテンプレートファイルを修正する
3. **ビルドプロセスを尊重する**: generate-slides.js → prepare-presentation.sh の流れでビルドする
4. **100vw × 100vh厳守**: すべてのスライドはビューポートに収まる必要がある
5. **サムネイル依存**: サムネイル一覧は prepare-presentation.sh で生成された画像を使用する

## 修正時の注意

- ✅ `.claude/skills/slide-generator/resources/styles.css` を修正
- ✅ `.claude/skills/slide-generator/resources/script.js` を修正
- ✅ `.claude/skills/slide-generator/generate-slides.js` を修正
- ❌ 生成されたHTMLファイル（output.html等）を直接修正しない
- ✅ **作業後の検証はChrome DevTools MCPで自分で確認すること**

## 修正履歴

### サムネイルナビゲーション修正 (2025-10-28)

**問題**: サムネイル一覧でクリックした番号と遷移先のスライドが1つずれる

**原因**: `resources/script.js:55-65` のグローバルクリックハンドラーがサムネイルクリック時も実行され、`currentSlide++` が二重に実行されていた

**修正**: サムネイル一覧をクリック除外対象に追加
```javascript
// 修正前
if (!e.target.closest('.progress-bar')) {

// 修正後
if (!e.target.closest('.progress-bar') && !e.target.closest('.thumbnail-view')) {
```

**ファイル**: `.claude/skills/slide-generator/resources/script.js`

### サムネイルアスペクト比修正 (2025-10-28)

**問題**: サムネイル一覧で画像が縦に潰れて表示される

**原因**: `.thumbnail-preview` のアスペクト比が `16 / 10` に設定されていたが、実際のスライドとサムネイル画像は `16 / 9`

**修正**: `resources/styles.css:544` のアスペクト比を修正
```css
/* 修正前 */
aspect-ratio: 16 / 10;

/* 修正後 */
aspect-ratio: 16 / 9;
```

**ファイル**: `.claude/skills/slide-generator/resources/styles.css`

### パス置換処理修正 (2025-10-28)

**問題**: prepare-presentation.shがpresentation.htmlのパスを正しく置換できず、script.jsが読み込まれない

**原因**: sedコマンドが`resources/`のみをマッチしていたが、実際のパスは`.claude/skills/slide-generator/resources/`と`./. claude/skills/slide-generator/resources/`の2種類存在した

**修正**: 両方のパス形式に対応するsedコマンドを追加
```bash
# 修正前
sed -i.bak 's|resources/|../resources/|g' "$SLIDE_DIR/index.html"

# 修正後
sed -i.bak 's|\./\.claude/skills/slide-generator/resources/|../resources/|g' "$SLIDE_DIR/index.html"
sed -i.bak 's|\.claude/skills/slide-generator/resources/|../resources/|g' "$SLIDE_DIR/index.html"
```

**ファイル**: `.claude/skills/slide-generator/scripts/prepare-presentation.sh`

### レイアウト横中央配置追加 (2025-10-28)

**問題**: 一部のスライドレイアウトで内容が横方向にセンタリングされていなかった

**対象スライド**:
- Slide 2: bullet-slide
- Slide 3: two-column
- Slide 7: table-slide
- Slide 8: code-slide (既に中央配置済み)
- Slide 10: profile-slide (既に中央配置済み)
- Slide 11: image-center (既に中央配置済み)
- Slide 15: diff-slide
- Slide 16: credits-slide

**修正アプローチ**: `.slide-content`自体に`max-width`と`margin: auto`を設定してコンテナを中央配置

```css
/* 例: bullet-slide */
.slide.bullet-slide .slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 900px;          /* 追加 */
  margin-left: auto;          /* 追加 */
  margin-right: auto;         /* 追加 */
}

.slide.bullet-slide .bullet-list {
  text-align: left;
}

/* 例: table-slide */
.slide.table-slide .slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 1000px;          /* 追加 */
  margin-left: auto;          /* 追加 */
  margin-right: auto;         /* 追加 */
}

/* 例: credits-slide */
.slide.credits-slide .slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 700px;           /* 追加 */
  margin-left: auto;          /* 追加 */
  margin-right: auto;         /* 追加 */
}
```

**メリット**:
- コンテンツ幅を制限しつつ中央配置を実現
- 各スライドタイプに最適な幅を個別設定可能
- レスポンシブ対応が容易

**検証**: Chrome DevTools MCPで各スライドの配置を確認し、`.slide-content`が正しく中央配置されていることを確認

**ファイル**: `.claude/skills/slide-generator/resources/styles.css`

### Two-columnレイアウト最適化 (2025-10-28)

**問題**:
1. スライド3（two-column）で左上の幾何学装飾とテキストが重なっていた
2. 横幅が狭く、装飾との距離が不十分
3. 左右のカラムが中央揃えで視覚的なバランスが取れていない

**修正**:
1. `max-width`を1100pxに拡大して横幅を広げる
2. 左カラムを`align-self: center`に設定し、`margin-bottom: 130px`で上へ
3. 右カラムを`align-self: center`に設定し、`margin-top: 130px`で下へ
4. カラム比率を50:50に変更

```css
.slide.two-column .slide-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;    /* 変更: centerからflex-start */
  justify-content: center;
  height: 100%;
  max-width: 1100px;          /* 変更: 950px → 1100px */
  margin-left: auto;
  margin-right: auto;
}

.slide.two-column .column-left {
  flex: 0 0 50%;              /* 変更: 55% → 50% */
  padding-right: var(--spacing-xl);
  align-self: center;         /* 追加: 中央基準 */
  margin-bottom: 130px;       /* 追加: 上へ */
}

.slide.two-column .column-right {
  flex: 0 0 50%;              /* 変更: 45% → 50% */
  display: flex;
  flex-direction: column;
  align-self: center;         /* 追加: 中央基準 */
  margin-top: 130px;          /* 追加: 下へ */
}
```

**効果**:
- 左カラム（Claude Code方式）が適度に上に配置され、左上の装飾と重ならない
- 右カラム（従来の方法）が適度に下に配置され、右下の装飾と重ならない
- 横幅が広がり、コンテンツがより読みやすく
- `flex-end`/`flex-start`よりも穏やかな配置で視覚的バランスが良好

**検証**: Chrome DevTools MCPでスライド3を確認し、装飾とテキストが重ならず、視覚的バランスが良好なことを確認

**ファイル**: `.claude/skills/slide-generator/resources/styles.css`
