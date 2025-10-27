# スライド生成スキル for Claude Code

Claude Codeで使えるプレゼンテーションスライド生成スキルです。

## 特徴

- **15種類のレイアウト**: タイトル、箇条書き、2カラム、グラフ、差分確認など
- **Chart.js統合**: 美しいグラフを自動生成
- **3つのワークフロー**: Markdown、対話、自動分割に対応
- **レスポンシブデザイン**: どんな画面でも美しく表示

## インストール

### Claude Codeで使用する場合

このスキルを `.claude/skills/` ディレクトリに配置してください。

```bash
# プロジェクトルートで実行
mkdir -p .claude/skills
cd .claude/skills
git clone <このリポジトリのURL> slide-generator
```

## 使い方

### 方法1: Markdownから生成（推奨）

1. `resources/content-template.md` をコピーして内容を記述
2. Claude Codeで「このMarkdownからスライドを生成して」と指示
3. 自動的にHTMLスライドが生成されます

### 方法2: 対話的に生成

```
あなた: 「新製品発表のスライドを作って」
Claude: 構成を提案します...
```

### 方法3: 自動分割・最適化

大量のテキストを投げるだけ：

```
あなた: 「新製品の発表スライドを作りたい。製品名はXYZ、
主な機能は高速処理、低消費電力、直感的UI。
従来製品と比べて処理速度3倍、電力消費50%削減...」

Claude: 内容を分析して最適なスライド構成を提案します
```

## 利用可能なレイアウト

### 基本レイアウト
1. **タイトルスライド** (`title-slide`)
2. **箇条書き** (デフォルト)
3. **終了スライド** (`ending-slide`)

### コンテンツ表示
4. **2カラム** (`two-column`)
5. **画像中心** (`image-center`)
6. **引用** (`quote-slide`)
7. **テーブル** (`table-slide`)
8. **コード表示** (`code-slide`)

### グラフレイアウト
9. **グラフスライド** (`chart-slide`)
10. **2つのグラフ並列** (`dual-chart-slide`)
11. **グラフ+テキスト** (`chart-text-slide`)

### 特殊レイアウト
12. **差分確認** (`diff-slide`)
13. **ワンラインテキスト** (`oneline-slide`)
14. **セクション区切り** (`section-slide`)
15. **フルサイズ画像背景** (`full-image`)

## ファイル構成

```
slide-generator/
├── SKILL.md                          # スキルの完全ガイド
└── resources/
    ├── template.html                 # シンプルなテンプレート
    ├── layouts-example.html          # 全18スライドのサンプル
    ├── styles.css                    # 全レイアウトのスタイル
    ├── logo.svg                      # SVGロゴ
    ├── layout-specs.md              # 各レイアウトの仕様書
    └── content-template.md          # 内容記述用テンプレート
```

## レイアウト仕様

各レイアウトの詳細な仕様（項目数、文字数制限、推奨内容）は `resources/layout-specs.md` を参照してください。

## 生成されるスライドの操作

- `→` (右矢印): 次のスライド
- `←` (左矢印): 前のスライド
- `Home`: 最初のスライドへ
- `End`: 最後のスライドへ

## サンプルを見る

`resources/layouts-example.html` をブラウザで開くと、全レイアウトのサンプルを確認できます。

## カスタマイズ

### ロゴの変更
`resources/logo.svg` を独自のロゴに置き換えてください。

### 色の変更
`resources/styles.css` のグラデーション設定を編集：
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## ライセンス

MIT License

## 作成者

Claude Code Skill

## 貢献

Issue や Pull Request を歓迎します！
