# Examples

このスキルを使用したプレゼンテーションの作成例を紹介します。

## 基本的な使い方

### 1. HTMLファイルを作成

テンプレートを参考にHTMLファイルを作成します：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>私のプレゼンテーション</title>
    <link rel="stylesheet" href="resources/styles.css">
</head>
<body>
    <div class="slides">
        <section class="slide title-slide">
            <h1>プレゼンテーションタイトル</h1>
            <p class="subtitle">サブタイトル</p>
        </section>

        <section class="slide">
            <h2>スライド2</h2>
            <ul>
                <li>ポイント1</li>
                <li>ポイント2</li>
                <li>ポイント3</li>
            </ul>
        </section>
    </div>

    <script src="resources/script.js"></script>
</body>
</html>
```

### 2. デプロイ用に準備

```bash
./scripts/prepare-presentation.sh my-presentation.html my-slides
```

これにより`deploy/my-slides/`ディレクトリに以下が作成されます：
- index.html
- thumbnails/ (自動生成されたサムネイル画像)
- 共通リソース（resources/）へのアクセス

### 3. ローカルで確認

```bash
open deploy/my-slides/index.html
```

### 4. デプロイ

```bash
cd deploy
surge --project . --domain my-slides.surge.sh
```

## レイアウト例

利用可能なレイアウトの詳細は`resources/layouts-example.html`を参照してください：

```bash
open resources/layouts-example.html
```

### 主なレイアウト

1. **タイトルスライド** (`title-slide`)
2. **箇条書きスライド** (デフォルト)
3. **2カラムスライド** (`two-column`)
4. **セクション区切り** (`section-slide`)
5. **テーブルスライド** (`table-slide`)
6. **グラフスライド** (`chart-slide`)
7. **コードスライド** (`code-slide`)
8. **カードレイアウト** (`infographic-slide`)

## 複数のスライドを管理

```bash
./scripts/prepare-presentation.sh presentation1.html project-a
./scripts/prepare-presentation.sh presentation2.html project-b
./scripts/prepare-presentation.sh presentation3.html project-c
```

deploy/ディレクトリ構造：
```
deploy/
├── resources/ (共通)
├── project-a/
│   ├── index.html
│   └── thumbnails/
├── project-b/
│   ├── index.html
│   └── thumbnails/
└── project-c/
    ├── index.html
    └── thumbnails/
```

一度のデプロイで複数のプレゼンテーションを公開：
```bash
cd deploy && surge
```

アクセスURL：
- https://your-domain.surge.sh/project-a/
- https://your-domain.surge.sh/project-b/
- https://your-domain.surge.sh/project-c/

## ホスティングオプション

### Surge.sh（推奨）
```bash
npm install -g surge
cd deploy
surge
```

### Netlify
```bash
npm install -g netlify-cli
cd deploy
netlify deploy --prod
```

### Cloudflare Pages
```bash
cd deploy
wrangler pages deploy .
```

## カスタマイズ

### スタイルのカスタマイズ

`resources/styles.css`を編集して独自のスタイルを追加できます。

### レイアウトの追加

`reference.md`を参照して、独自のレイアウトクラスを定義できます。
