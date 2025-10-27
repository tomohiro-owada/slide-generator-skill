# デザインシステム適用スキル

## 概要
このスキルは、Wolseyデザインシステムに基づいてスライドテンプレートを生成・修正します。

## 目的
- デザインシステム.mdの定義に完全準拠したスライドを作成
- 既存のスライドをデザインシステムに沿って修正
- 一貫性のあるビジュアルデザインを保証

## 実行フロー

### 1. デザインシステムの読み込み
まず、プロジェクトルートにある `デザインシステム.md` を読み込んでください。

```bash
デザインシステムファイルパス: /Users/towada/projects/claude-slide-template/デザインシステム.md
```

### 2. ユーザーの要求を確認
以下のいずれかのタスクを実行します：

- **新規スライド作成**: レイアウトパターンを選択してスライドを生成
- **既存スライド修正**: HTMLファイルをデザインシステムに準拠するよう修正
- **カラーパレット適用**: 色のみを修正
- **レイアウト再構成**: レイアウトパターンを適用

### 3. レイアウトパターンの選択

デザインシステムで定義された7つのレイアウトパターンから選択：

1. **タイトルスライド** - プレゼンテーションのオープニング
2. **2カラムレイアウト（テキスト＋画像）** - 説明と画像の組み合わせ
3. **引用スライド** - 引用文を強調表示
4. **箇条書きスライド** - リスト形式の情報
5. **3カラムレイアウト** - 並列情報の比較
6. **全画面画像スライド** - インパクトのあるビジュアル
7. **エンディング/クレジットスライド** - クロージング

ユーザーに対して、どのレイアウトを使用するか質問してください。

### 4. HTML/CSSの生成

以下の要素を必ず含めてください：

#### カラー変数（CSS）
```css
:root {
  /* Primary Colors */
  --sky-blue: #5DADE2;
  --ocean-blue: #3498DB;
  --deep-blue: #2E86C1;
  --teal-blue: #48C9B0;

  /* Secondary Colors */
  --vibrant-orange: #F39C12;

  /* Neutral Colors */
  --pure-white: #FFFFFF;
  --light-gray: #7F8C8D;
  --cool-gray: #95A5A6;

  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
  --spacing-3xl: 96px;
  --spacing-4xl: 128px;

  /* Margins */
  --margin-horizontal: 120px;
  --margin-vertical: 80px;
}
```

#### 幾何学的装飾の実装
左上・右下に配置する傾斜長方形パターン：

```html
<div class="geometric-decoration top-left">
  <div class="shape shape-1"></div>
  <div class="shape shape-2"></div>
  <div class="shape shape-3"></div>
  <div class="shape shape-4"></div>
</div>

<div class="geometric-decoration bottom-right">
  <div class="shape shape-1"></div>
  <div class="shape shape-2"></div>
  <div class="shape shape-3"></div>
  <div class="shape shape-4"></div>
  <div class="shape shape-5"></div>
</div>
```

```css
.geometric-decoration {
  position: absolute;
  z-index: 1;
}

.geometric-decoration.top-left {
  top: 0;
  left: 0;
}

.geometric-decoration.bottom-right {
  bottom: 0;
  right: 0;
}

.geometric-decoration .shape {
  position: absolute;
  width: 150px;
  height: 400px;
  transform: rotate(-20deg);
  opacity: 0.85;
}

/* カラーバリエーションは各レイアウトに応じて調整 */
```

#### タイポグラフィスタイル
```css
h1 {
  font-size: 84px;
  font-weight: 900;
  color: var(--pure-white);
  line-height: 1.2;
  letter-spacing: normal;
}

h2 {
  font-size: 54px;
  font-weight: 700;
  color: var(--ocean-blue);
  line-height: 1.3;
}

h3 {
  font-size: 42px;
  font-weight: 700;
  color: var(--sky-blue);
}

h4 {
  font-size: 28px;
  font-weight: 700;
  color: var(--cool-gray);
}

body, p {
  font-size: 20px;
  font-weight: 400;
  color: var(--cool-gray);
  line-height: 1.5;
}

.body-large {
  font-size: 22px;
  line-height: 1.6;
}

.caption {
  font-size: 14px;
  color: var(--light-gray);
}

.accent-heading {
  font-size: 60px;
  font-weight: 900;
  color: var(--vibrant-orange);
}

.quote {
  font-size: 32px;
  font-weight: 400;
  color: var(--ocean-blue);
  line-height: 1.4;
  font-style: italic;
}
```

#### スライドコンテナ
```css
.slide {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
}

.slide-content {
  position: relative;
  z-index: 10;
  padding: var(--margin-vertical) var(--margin-horizontal);
}
```

### 5. レイアウトパターン別実装例

#### パターン1: タイトルスライド
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>タイトルスライド</title>
  <style>
    /* CSS変数とベーススタイルをここに */

    .slide.title-slide {
      background: linear-gradient(135deg, var(--sky-blue) 0%, var(--ocean-blue) 100%);
    }

    .title-slide h1 {
      margin-top: 300px;
      margin-left: 0;
      max-width: 1200px;
    }
  </style>
</head>
<body>
  <div class="slide title-slide">
    <div class="geometric-decoration top-left">
      <div class="shape shape-1" style="background: rgba(255,255,255,0.2); top: -50px; left: -50px;"></div>
      <div class="shape shape-2" style="background: var(--vibrant-orange); top: 0; left: 0;"></div>
      <div class="shape shape-3" style="background: rgba(72,201,176,0.7); top: 30px; left: 50px;"></div>
      <div class="shape shape-4" style="background: var(--deep-blue); top: 60px; left: 100px;"></div>
    </div>

    <div class="geometric-decoration bottom-right">
      <div class="shape shape-1" style="background: rgba(255,255,255,0.3); bottom: -100px; right: -50px;"></div>
      <div class="shape shape-2" style="background: rgba(93,173,226,0.6); bottom: -50px; right: 0;"></div>
      <div class="shape shape-3" style="background: var(--vibrant-orange); bottom: 0; right: 50px;"></div>
      <div class="shape shape-4" style="background: var(--deep-blue); bottom: 50px; right: 100px;"></div>
    </div>

    <div class="slide-content">
      <h1>ここにプレゼンテーション<br>タイトルが入ります</h1>
    </div>
  </div>
</body>
</html>
```

#### パターン4: 箇条書きスライド
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>箇条書きスライド</title>
  <style>
    /* CSS変数とベーススタイルをここに */

    .slide.bullet-slide {
      background: var(--pure-white);
    }

    .bullet-slide h2 {
      margin-bottom: var(--spacing-lg);
    }

    .bullet-list {
      list-style: none;
      padding: 0;
    }

    .bullet-list li {
      margin-bottom: var(--spacing-md);
      padding-left: var(--spacing-xl);
      position: relative;
    }

    .bullet-list li::before {
      content: '»';
      position: absolute;
      left: 0;
      color: var(--sky-blue);
      font-size: 24px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="slide bullet-slide">
    <div class="geometric-decoration top-left">
      <!-- 装飾要素 -->
    </div>

    <div class="geometric-decoration bottom-right">
      <!-- 装飾要素 -->
    </div>

    <div class="slide-content">
      <h2>これはスライドタイトルです</h2>
      <ul class="bullet-list">
        <li>ここにアイテムのリストがあります</li>
        <li>いくつかのテキスト</li>
        <li>スライドにコンテンツを詰め込みすぎないように注意してください</li>
      </ul>
      <p class="body-large" style="margin-top: var(--spacing-xl);">
        聴衆はあなたの話を聞くか、コンテンツを読むかのどちらかですが、両方は行いません。
      </p>
    </div>
  </div>
</body>
</html>
```

### 6. デザインシステム準拠チェックリスト

生成・修正後、以下の項目を必ず確認してください：

- [ ] カラーパレット内の色のみを使用しているか
- [ ] 幾何学的装飾が左上・右下に正しく配置されているか
- [ ] フォントサイズがタイポグラフィスケールに準拠しているか
- [ ] マージン・パディングがスペーシングシステムに準拠しているか
- [ ] スライドサイズが 1920x1080px (16:9) か
- [ ] テキストの階層構造が明確か
- [ ] コントラスト比が適切か（アクセシビリティ）
- [ ] 余白が十分に確保されているか

### 7. 出力形式

以下のいずれかの形式で出力してください：

1. **単一HTMLファイル**: スタイルを含む完全なHTMLファイル
2. **HTML + CSS分離**: HTMLファイルとCSSファイルを別々に生成
3. **修正内容の説明**: 既存ファイルへの変更点を説明

### 8. ユーザーへの確認事項

作業開始前に以下を確認してください：

1. どのレイアウトパターンを使用しますか？（1-7から選択）
2. スライドのコンテンツ（タイトル、本文、画像など）
3. 出力形式の希望（単一HTML / 分離 / 説明のみ）
4. 既存ファイルの修正の場合、ファイルパスを提供してください

## 使用例

### 例1: 新規タイトルスライド作成
```
ユーザー: タイトルスライドを作成してください。タイトルは「AI技術の未来」です。
アシスタント:
1. デザインシステムを読み込みます
2. レイアウトパターン1（タイトルスライド）を使用
3. Sky Blueグラデーション背景を適用
4. 幾何学的装飾を配置
5. HTMLファイルを生成
```

### 例2: 既存スライドの修正
```
ユーザー: この箇条書きスライドをデザインシステムに準拠させてください。
アシスタント:
1. デザインシステムを読み込みます
2. 現在のスライドを分析
3. カラーパレット、タイポグラフィ、スペーシングを修正
4. 幾何学的装飾を追加
5. 修正されたHTMLを提供
```

## リソースファイル

このスキルでは以下のリソースを参照します：

- `/Users/towada/projects/claude-slide-template/デザインシステム.md` - デザインシステム定義書
- `./resources/template-base.html` - 基本テンプレート（オプション）
- `./resources/styles.css` - 共通スタイル（オプション）

## 制約事項

- デザインシステム.mdの定義から逸脱しないこと
- カラーパレット外の色を使用しないこと
- 幾何学的装飾パターンを変更しないこと
- フォントファミリーはサンセリフ体に統一すること

## 注意事項

- 画像を使用する場合は、プレースホルダーまたはUnsplashなどのフリー画像サービスを提案
- レスポンシブデザインは不要（固定サイズ: 1920x1080px）
- ブラウザ互換性は最新版Chrome/Firefoxを想定

---

**スキル実行開始**

それでは、デザインシステムに基づいたスライド作成を開始します。
まず `デザインシステム.md` を読み込んで、ユーザーの要求を確認します。
