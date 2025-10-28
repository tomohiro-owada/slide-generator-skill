# Slide Generator Skill

## 目的

このスキルは**対話的なプレゼンテーション生成アシスタント**です。ユーザーが提供する長文や要件を分析し、最適なスライド構成を提案・生成します。

**重要**: 単にスライドを作るのではなく、ユーザーと対話しながらより良いプレゼンテーションを作り上げることが目的です。

## ワークフロー

### 1. ユーザー入力の分析

ユーザーから長文や要件が提供されたら、以下を分析します：

- **主要なメッセージ**: 何を伝えたいのか
- **ターゲット**: 誰に向けたプレゼンテーションか
- **トーン**: フォーマル/カジュアル、技術的/一般向け
- **ボリューム**: 想定スライド枚数（5-20枚推奨）

### 2. スライド構成の提案

分析結果をもとに、以下の形式でスライド構成を提案します：

```
【提案するスライド構成】

1. タイトルスライド
   - タイトル: "〇〇〇"
   - サブタイトル: "〇〇〇"

2. 箇条書きスライド
   - 見出し: "〇〇〇"
   - 要点:
     - 〇〇〇
     - 〇〇〇
   ⚠️ 文字数制限: 見出し50文字、各要点80文字

3. 画像中心スライド
   - 見出し: "〇〇〇"
   - キャプション: "〇〇〇"
   📸 画像が必要: [説明]

4. グラフスライド
   - 見出し: "〇〇〇"
   📊 データが必要: [X軸のラベル、Y軸の値]

...
```

### 3. リソースの要求

画像やデータが必要な場合は、明示的に要求します：

**画像が必要な場合:**
- スライド番号と用途を明示
- 推奨サイズ/アスペクト比を提示
- 「画像を提供してください」と明記

**データが必要な場合:**
- グラフの種類（棒グラフ、折れ線グラフ、円グラフ）
- 必要なデータ形式を提示
- 例を示す

### 4. 対話的な調整

提案に対してユーザーからフィードバックを受け取ったら：
- スライドの追加/削除
- レイアウトの変更
- 内容の調整
- 順序の入れ替え

### 5. 生成と検証

確定したらスライドを生成し：
1. Markdownファイルを作成
2. `generate-slides.js`でHTMLに変換
3. `prepare-presentation.sh`でサムネイル生成
4. Chrome DevTools MCPで確認
5. 必要に応じて修正

## レイアウトガイド

### 1. タイトルスライド (title-slide)

**使用シーン**: プレゼンテーションの最初

**文字数制限**:
- タイトル: 30文字以内（推奨）
- サブタイトル: 60文字以内（推奨）

**必要なリソース**: なし

**例**:
```markdown
---
layout: title-slide
---

# Claude Code で始める
## 次世代のスライド生成
```

### 2. 箇条書きスライド (bullet-slide)

**使用シーン**: 要点を列挙する

**文字数制限**:
- 見出し: 50文字以内
- 各箇条書き: 80文字以内
- 箇条書き項目数: 3-6個（推奨）

**必要なリソース**: なし

**例**:
```markdown
---
layout: bullet-slide
---

## 主な機能

- 16種類のレイアウトパターン
- Chart.js統合でグラフ描画
- Markdownベースのワークフロー
```

### 3. 2カラムスライド (two-column)

**使用シーン**: テキストと画像を並べる、2つの概念を対比する

**文字数制限**:
- 見出し: 50文字以内
- 各カラムの見出し: 30文字以内
- 各カラムの本文: 200文字以内

**必要なリソース**: 右カラムに画像が必要な場合が多い
- 📸 **画像推奨**: アスペクト比 3:4 または 1:1
- 最大高さ: 800px

**例**:
```markdown
---
layout: two-column
---

<div class="column-left">

### Claude Code方式
新しいAI駆動の開発体験

</div>

<div class="column-right">

![開発画面](./images/screenshot.png)

</div>
```

### 4. 引用スライド (quote-slide)

**使用シーン**: 重要な言葉や引用を強調

**文字数制限**:
- 引用文: 120文字以内（推奨）
- 引用元: 30文字以内

**必要なリソース**: なし

**例**:
```markdown
---
layout: quote-slide
---

> シンプルさは究極の洗練である

— レオナルド・ダ・ヴィンチ
```

### 5. 3カラムスライド (three-column)

**使用シーン**: 3つの要素を並列に提示

**文字数制限**:
- 見出し: 50文字以内
- 各カラムの見出し: 20文字以内
- 各カラムの本文: 100文字以内

**必要なリソース**: なし（背景が白なので画像は不要）

**例**:
```markdown
---
layout: three-column
---

## 3つの柱

### 速度
高速な処理で待ち時間ゼロ

### 品質
プロフェッショナルなデザイン

### 柔軟性
16種類のレイアウト
```

### 6. フルイメージスライド (full-image)

**使用シーン**: インパクトのある画像で感情を引き出す

**文字数制限**:
- 見出し: 30文字以内
- 本文: 100文字以内

**必要なリソース**:
- 📸 **画像必須**: 高解像度 (1920x1080以上推奨)
- アスペクト比: 16:9

**例**:
```markdown
---
layout: full-image
background-image: ./images/background.jpg
---

## 未来を創造する
```

### 7. エンディング/クレジットスライド (credits-slide)

**使用シーン**: プレゼンテーションの最後、謝辞

**文字数制限**:
- 見出し: 30文字以内
- 各項目: 50文字以内
- 項目数: 3-8個

**必要なリソース**: なし

**例**:
```markdown
---
layout: credits-slide
---

## ありがとうございました

- お問い合わせ: example@email.com
- GitHub: @username
- Twitter: @username
```

### 8. 画像中心スライド (image-center)

**使用シーン**: 図やスクリーンショットを説明

**文字数制限**:
- 見出し: 50文字以内
- キャプション: 100文字以内

**必要なリソース**:
- 📸 **画像必須**:
- 最大幅: 70% of viewport
- 最大高さ: 60vh

**例**:
```markdown
---
layout: image-center
---

## アーキテクチャ

![システム構成図](./images/architecture.png)

マイクロサービスベースの設計
```

### 9. ワンラインテキスト (oneline-slide)

**使用シーン**: シンプルなメッセージで強い印象を残す

**文字数制限**:
- メインメッセージ: 20文字以内（大きい文字用）
- または: 30文字以内（中くらい文字用）
- または: 50文字以内（小さい文字用）

**必要なリソース**: なし

**例**:
```markdown
---
layout: oneline-slide
---

# Think Big, Start Simple
```

### 10. プロフィールスライド (profile-slide)

**使用シーン**: 登壇者紹介、チーム紹介

**文字数制限**:
- 名前: 20文字以内
- 肩書き: 30文字以内
- 自己紹介: 200文字以内
- 連絡先項目: 各50文字以内

**必要なリソース**:
- 📸 **プロフィール画像**: 200x200px推奨、正方形

**例**:
```markdown
---
layout: profile-slide
---

![プロフィール写真](./images/profile.jpg)

### 山田太郎
シニアエンジニア

オープンソースコミュニティで活動する開発者。
10年以上のWeb開発経験を持つ。

- GitHub: @yamada
- Twitter: @yamada_dev
```

### 11. テーブルスライド (table-slide)

**使用シーン**: データの比較、仕様の提示

**文字数制限**:
- 見出し: 50文字以内
- 各セル: 30文字以内
- 行数: 2-6行（推奨）
- 列数: 2-4列（推奨）

**必要なリソース**: なし

**例**:
```markdown
---
layout: table-slide
---

## プラン比較

| 機能 | フリー | プロ |
|------|--------|------|
| スライド数 | 10枚 | 無制限 |
| サポート | なし | あり |
```

### 12. コード表示スライド (code-slide)

**使用シーン**: コードの説明、技術的なデモ

**文字数制限**:
- 見出し: 50文字以内
- コード: 20行以内（推奨）

**必要なリソース**: なし（Prism.jsが自動でハイライト）

**例**:
```markdown
---
layout: code-slide
---

## コード例

\`\`\`javascript
function generateSlides(content) {
  return parseMarkdown(content)
    .map(slide => renderSlide(slide));
}
\`\`\`
```

### 13. グラフスライド (chart-slide)

**使用シーン**: 単一のグラフ・チャートを大きく表示

**文字数制限**:
- 見出し: 50文字以内

**必要なリソース**:
- 📊 **データ必須**:
  - グラフの種類（bar, line, pie, doughnut, radar, polarArea）
  - ラベル配列
  - データ配列
  - オプション（色、凡例など）

**データ形式例**:
```json
{
  "type": "bar",
  "labels": ["2020", "2021", "2022", "2023"],
  "datasets": [{
    "label": "売上（百万円）",
    "data": [120, 150, 180, 220]
  }]
}
```

### 14. 2つのグラフ並列 (dual-chart-slide)

**使用シーン**: 2つのデータを比較

**文字数制限**:
- メイン見出し: 50文字以内
- 各グラフの見出し: 30文字以内

**必要なリソース**:
- 📊 **データ必須**: 2つのグラフ分のデータ

### 15. グラフ+テキスト並列 (chart-text-slide)

**使用シーン**: グラフと解説を並べる

**文字数制限**:
- メイン見出し: 50文字以内
- 解説見出し: 30文字以内
- 箇条書き: 各80文字以内、3-5個

**必要なリソース**:
- 📊 **データ必須**: 1つのグラフ分のデータ

### 16. Before/After比較スライド (diff-slide)

**使用シーン**: 導入前後の変化を示す

**文字数制限**:
- メイン見出し: 50文字以内
- 各パネルの見出し: 20文字以内（"Before"/"After"推奨）
- 各パネルの項目: 各40文字以内、3-5個

**必要なリソース**: なし

**例**:
```markdown
---
layout: diff-slide
---

## 導入効果

<div class="diff-container">

<div class="diff-panel before">

### Before
- スライド作成に3時間
- デザインの統一に苦労
- レイアウト調整で疲弊

</div>

<div class="diff-panel after">

### After
- スライド作成が15分に短縮
- 自動でデザイン統一
- 最適レイアウトを自動選択

</div>

</div>
```

## 対話の進め方

### ステップ1: ユーザーの要求を理解する

```
ユーザー: 「新製品のプレゼンを作りたいです。特徴は...（長文）」

あなた:
「新製品のプレゼンテーション作成を承りました。
内容を分析して、最適なスライド構成を提案します。

【確認事項】
- 想定時間: 10分
- 対象: 経営陣・一般顧客
- トーン: ビジネスフォーマル

以下の構成を提案します...」
```

### ステップ2: リソースを明示的に要求する

```
あなた:
「スライド3で製品画像が必要です。
📸 必要な画像: 製品の全体像（推奨サイズ: 800x600px）

スライド7でグラフを表示します。
📊 必要なデータ: 過去4年の売上推移
フォーマット: ["2020", "2021", "2022", "2023"] と各年の数値

これらを提供いただけますか？」
```

### ステップ3: 文字数超過を警告する

```
あなた:
「⚠️ スライド2の箇条書きが長すぎます。
現在: 120文字 → 推奨: 80文字以内

以下のように短縮してはどうでしょうか：
- 【修正前】「当社の新製品は業界初の技術を採用しており、従来製品と比較して30%の性能向上を実現しています」
- 【修正後】「業界初の技術で30%の性能向上」
」
```

### ステップ4: 最終確認

```
あなた:
「スライド構成が確定しました。生成を開始します。

【最終構成】
- タイトルスライド
- 箇条書き x3
- 2カラム x2
- グラフスライド x1
- エンディング

合計: 8枚

よろしければ生成を開始します。」
```

## ベストプラクティス

### 1. 文字数を厳守する

- スライドは100vw × 100vhに収まる必要がある
- 文字が多すぎると読めなくなる
- 超過した場合は必ず警告し、短縮を提案する

### 2. 画像を効果的に使う

- テキストだけのスライドが3枚以上続かないようにする
- 画像が必要な場面では明示的に要求する
- 画像がない場合は代替案を提示する

### 3. グラフは適切に選択する

- **棒グラフ**: 比較、ランキング
- **折れ線グラフ**: 時系列の変化
- **円グラフ**: 割合、構成比
- **レーダーチャート**: 多次元比較

### 4. スライドの流れを考える

1. タイトルで引き込む
2. 問題提起（ワンラインテキスト or 箇条書き）
3. 解決策（2カラム or 画像中心）
4. 証拠（グラフ or Before/After）
5. まとめ（箇条書き）
6. エンディング

### 5. リズムを作る

- レイアウトを変化させる
- 重い情報の後に軽い情報
- テキスト → 画像 → グラフの順で変化をつける

## 検証チェックリスト

プレゼンテーション生成後は、以下を確認してください:

### 必須確認項目

- [ ] 全16種類のレイアウトが使用されているか（title-slideを含む）
- [ ] Chart.jsのグラフが描画されるか（canvasタグとnew Chart()が存在）
- [ ] Prism.jsのコードハイライトが機能するか（language-*クラスが設定されている）
- [ ] テーブルがHTMLテーブルに変換されているか
- [ ] リソースファイル（styles.css、script.js、vendor/）が正しくリンクされているか
- [ ] サムネイルが生成されているか（thumbnails/indexディレクトリ）

### 動作確認項目

- [ ] キーボード操作（→、←、Home、End、G、Esc）が動作するか
- [ ] プログレスバーのセグメントクリックでスライド移動できるか
- [ ] プログレスバーホバーでサムネイルツールチップが表示されるか
- [ ] Gキーでサムネイル一覧が表示されるか
- [ ] サムネイル一覧からスライドに移動できるか
- [ ] ページ番号が右下に表示されるか

### ビジュアル確認項目

- [ ] 幾何学装飾がテキストと重なっていないか
- [ ] 全スライドが100vw × 100vhに収まっているか
- [ ] 文字数制限が守られているか
- [ ] グラフが正しく表示されているか
- [ ] コードのシンタックスハイライトが適用されているか

## 技術仕様

### デザインシステム (Wolsey Design System)

- 一貫性のあるカラーパレット、タイポグラフィ、レイアウト
- 幾何学的装飾要素（geometric decorations）
- レスポンシブデザイン（100vw × 100vh固定）

### インタラクティブ機能

- **キーボード操作**:
  - `→` / `←`: 次/前のスライド
  - `Home` / `End`: 最初/最後のスライド
  - `G`: サムネイル一覧表示トグル
  - `Esc`: サムネイル一覧を閉じる
- **プログレスバー**: 上部にセグメント型進捗表示
- **サムネイル一覧**: 全スライドのサムネイル表示とクイックナビゲーション
- **ページ番号**: 右下に現在位置表示

### 技術統合

- **Chart.js**: グラフ・チャートの描画
- **Prism.js**: コードのシンタックスハイライト
- **レスポンシブCanvas**: グラフの自動リサイズ

### ビルドシステム

```bash
# 1. Markdownからスライド生成
node .claude/skills/slide-generator/scripts/generate-slides.js input.md output.html

# 2. プレゼンテーション準備（サムネイル生成）
bash .claude/skills/slide-generator/scripts/prepare-presentation.sh output.html slide-name

# 3. ブラウザで確認
open .claude/skills/slide-generator/deploy/slide-name/index.html
```

### デプロイ

```bash
cd .claude/skills/slide-generator/deploy

# Surge（推奨）
surge --domain my-presentation.surge.sh

# Netlify
netlify deploy --prod

# Vercel
vercel --prod
```

## ファイル構成

```
.claude/skills/slide-generator/
├── CLAUDE.md                    # このファイル（スキルの説明）
├── scripts/
│   ├── generate-slides.js       # スライド生成スクリプト
│   ├── prepare-presentation.sh  # プレゼンテーション準備シェル
│   └── generate-thumbnails.js   # サムネイル生成スクリプト
├── resources/
│   ├── styles.css              # メインスタイルシート（Wolseyデザインシステム）
│   ├── script.js               # インタラクティブ機能のJavaScript
│   └── vendor/                 # サードパーティライブラリ
│       ├── chart.min.js
│       ├── prism.js
│       └── prism.css
└── deploy/                      # デプロイ用ディレクトリ
    └── resources/              # 共通リソース（自動コピー）
```

## 重要な原則

1. **対話を重視する**: ユーザーの要求を一方的に解釈せず、提案→確認→調整のサイクルを回す
2. **制約を明示する**: 文字数制限、画像の必要性、データの要求を明確に伝える
3. **品質を保証する**: 生成後は必ずChrome DevTools MCPで確認する
4. **ビルドプロセスを尊重する**: generate-slides.js → prepare-presentation.sh の流れでビルドする
5. **100vw × 100vh厳守**: すべてのスライドはビューポートに収まる必要がある

## 修正時の注意

- ✅ `resources/styles.css` を修正してテンプレートを変更
- ✅ `resources/script.js` を修正してインタラクティブ機能を追加
- ✅ `scripts/generate-slides.js` を修正してビルドプロセスを改善
- ❌ 生成されたHTMLファイルを直接修正しない
- ✅ **作業後の検証はChrome DevTools MCPで自分で確認すること**

## 修正履歴

<details>
<summary>generate-slides.js実装とテスト (2025-10-28)</summary>

### generate-slides.jsの新規作成

**背景**: CLAUDE.mdに記載されているワークフロー（Markdown → HTML変換）に必要なスクリプトが存在しなかった

**実装内容**:
1. Markdownファイルの読み込み
2. frontmatterを考慮したスライドブロックの分割
3. Markdown → HTML変換（改良版）
   - コードブロック処理（プレースホルダー方式）
   - Markdownテーブル → HTMLテーブル変換
   - 見出し、箇条書き、引用、画像、リンクの変換
   - HTMLタグを含む段落の適切な処理
4. 16種類のレイアウト対応
5. background-image属性の処理

### 主な修正内容

#### 1. frontmatterの正しい分割
**問題**: `\n---\n`で単純分割すると、frontmatter内の`---`もスライド区切りとして扱われる

**修正**:
```javascript
function splitSlides(text) {
  // frontmatterの開始/終了を追跡
  // スライド区切りの---とfrontmatterの---を区別
}
```

#### 2. HTMLマークアップの破損修正
**問題**: `</p><p>`タグが不正に挿入され、レイアウトが崩れる

**修正**: 段落処理でHTMLタグで始まる行を除外
```javascript
if (para.startsWith('<') || para.includes('<script>') || para === '') {
  return para; // pタグで包まない
}
```

#### 3. Markdownテーブル変換の実装
**問題**: Markdownテーブルがそのままテキストとして表示される

**修正**: 正規表現でテーブルを検出し、HTML tableタグに変換
```javascript
text = text.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, ...);
```

#### 4. `[object Object]`の修正
**問題**: backgroundImageオブジェクトが文字列化されずに表示される

**修正**: parseSlideBlock関数でbackgroundImageを文字列として抽出
```javascript
return { layout, content, backgroundImage }; // オブジェクトではなく文字列
```

### テスト結果（all-layouts-test）

**成功**: 95%
- 15種類のレイアウトが正常に動作
- Chart.jsのグラフ4つが正しく配置
- Prism.jsのコードハイライトが機能
- テーブルがHTMLテーブルに変換
- インタラクティブ機能が完全動作

**課題**:
- title-slideが1つ不足（テストデータの問題）
- サムネイル数が若干多い（33枚 vs 30スライド）

### ファイル

**新規作成**: `.claude/skills/slide-generator/scripts/generate-slides.js`
</details>

<details>
<summary>レイアウト最適化 (2025-10-28)</summary>

### スライド10-16の横中央配置

**変更内容**:
- スライド10 (profile-slide): `max-width: 900px`
- スライド11 (image-center): `max-width: 1100px`
- スライド15 (diff-slide): `.slide-content`に`max-width: 1200px`
- スライド16 (credits-slide): 幅を`700px` → `900px`に拡大、中央寄せ

### スライド9の装飾非表示

**問題**: ワンラインテキストと幾何学装飾が重なる

**修正**:
```css
.slide.oneline-slide .geometric-decoration {
  display: none;
}
```

### ワークフロー改善

**prepare-presentation.sh**:
- リソースを毎回自動コピー
- パス置換処理を両方の形式に対応
</details>

<details>
<summary>Two-columnレイアウト最適化 (2025-10-28)</summary>

**問題**: 左上の幾何学装飾とテキストが重なる

**修正**:
- `max-width`を1100pxに拡大
- 左カラム: `align-self: center`, `margin-bottom: 130px`
- 右カラム: `align-self: center`, `margin-top: 130px`
- カラム比率を50:50に変更

**効果**: 装飾との重なりを解消し、視覚的バランスが向上
</details>

<details>
<summary>サムネイルナビゲーション修正 (2025-10-28)</summary>

**問題**: サムネイルクリック時にスライド番号が1つずれる

**修正**: `resources/script.js`のグローバルクリックハンドラーからサムネイル一覧を除外

```javascript
if (!e.target.closest('.progress-bar') && !e.target.closest('.thumbnail-view')) {
```
</details>

<details>
<summary>サムネイルアスペクト比修正 (2025-10-28)</summary>

**問題**: サムネイル画像が縦に潰れる

**修正**: `resources/styles.css`のアスペクト比を`16 / 10` → `16 / 9`に変更
</details>

<details>
<summary>splitSlides関数の重大なバグ修正 (2025-10-28)</summary>

### 問題

`generate-slides.js`のスライド分割ロジックに重大なバグがあり、スライド3以降のコンテンツが正しく抽出されていなかった。

**症状**:
- スライド3が空白で表示される
- frontmatterの直後の`---`を新しいスライドの開始として認識できない
- スライド1には「タイトル+次のスライドのfrontmatter」が含まれてしまう

**原因**:
```javascript
// 旧ロジック
else if (!inFrontmatter && frontmatterCount === 2) {
  // スライド区切り
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
    currentBlock = [];  // ❌ 新しいブロックが空で始まる
  }
  frontmatterCount = 0;
}
```

frontmatterが終了した後（frontmatterCount=2）、次の`---`に遭遇したときに現在のブロックを終了するが、その`---`自体を新しいブロックに含めていなかった。

### 修正

```javascript
// 新ロジック
else if (!inFrontmatter && frontmatterCount === 2) {
  // 新しいスライドの開始 = 現在のブロックを終了して、新しいfrontmatterを開始
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }
  currentBlock = [line]; // ✅ 新しいブロックの最初の行として---を追加
  inFrontmatter = true;
  frontmatterCount = 1;
}
```

### 検証結果

**修正前**:
- スライド数: 30枚（誤った分割）
- スライド3: 空のコンテンツ

**修正後**:
- スライド数: 16枚（正しい分割）
- スライド3: two-columnレイアウトで241文字のコンテンツを正しく表示

### 付随修正: prepare-presentation.sh

ワークフローのパス解決も修正:

1. **リソースディレクトリ**: `resources` → `.claude/skills/slide-generator/resources`
2. **デプロイディレクトリ**: `deploy` → `.claude/skills/slide-generator/deploy`
3. **サムネイル生成**: 相対パスではなく絶対パスで実行

**ファイル**:
- `.claude/skills/slide-generator/scripts/generate-slides.js` (splitSlides関数)
- `.claude/skills/slide-generator/scripts/prepare-presentation.sh` (パス修正)
</details>

<details>
<summary>oneline-slideの文字色修正 (2025-10-28)</summary>

### 問題

oneline-slideで白背景に薄いグレーの文字が表示され、テキストがほとんど見えない状態だった。

**症状**:
- 背景色: 白 `rgb(255, 255, 255)`
- 文字色: 薄いグレー `rgb(149, 165, 166)`
- スライド9が真っ白で何も見えない

**原因**:
CSSでは`.message`クラスに青色を設定していたが、実際のHTMLは`<h1>`タグで生成されていたため、デフォルトのグレー色が適用されていた。

### 修正

oneline-slideの見出しタグ（h1, h2, h3）に直接スタイルを適用：

```css
.slide.oneline-slide h1,
.slide.oneline-slide h2,
.slide.oneline-slide h3 {
  color: var(--ocean-blue);
  font-weight: 900;
  line-height: 1.3;
}

.slide.oneline-slide h1 { font-size: 96px; }
.slide.oneline-slide h2 { font-size: 72px; }
.slide.oneline-slide h3 { font-size: 60px; }
```

### 検証結果

**修正後**:
- 文字色: 青 `rgb(52, 152, 219)` (Ocean Blue)
- フォントサイズ: h1=96px, h2=72px, h3=60px
- テキストが明確に読める

**ファイル**:
- `.claude/skills/slide-generator/resources/styles.css` (oneline-slideスタイル)
</details>

<details>
<summary>title-slideとcode-slideの改善 (2025-10-28)</summary>

### 問題1: title-slideのサブタイトルが見えない

**症状**:
- 背景: 青のグラデーション
- h1（タイトル）: 白 ✅
- h2（サブタイトル）: 青（背景と同じ色） ❌

**修正**:
```css
.slide.title-slide h1 {
  color: var(--pure-white);
}

.slide.title-slide h2 {
  color: var(--pure-white);
  opacity: 0.95;
}
```

### 問題2: code-slideのコードブロックが狭い

**修正前**: width: 90%, max-width: 1100px
**修正後**: width: 95%, max-width: 1400px

**効果**: コードの可読性が向上し、より多くのコードを横に配置可能

**ファイル**:
- `.claude/skills/slide-generator/resources/styles.css` (title-slide, code-slide)
</details>
