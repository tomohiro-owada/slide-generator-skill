# プレゼンテーション内容テンプレート

このファイルにスライドの内容を記述してください。各スライドは `---` で区切ります。

## 記述方法

各スライドは以下の形式で記述します：

```markdown
---
layout: レイアウト名
---

# 見出し

内容...
```

---

## サンプルプレゼンテーション

以下は各レイアウトのサンプルです。必要な部分をコピーして使用してください。

---
layout: title-slide
---

# プレゼンテーションタイトル

サブタイトル・2024年10月27日・発表者名

---
layout: slide
---

# 概要

- ポイント1: 主要な特徴
- ポイント2: 重要な利点
- ポイント3: 期待される効果
- ポイント4: 次のステップ

---
layout: two-column
---

# 比較

## 従来の方法

- 手動での作業が必要
- 時間がかかる
- エラーが発生しやすい

## 新しい方法

- 自動化により効率的
- 処理時間が大幅に短縮
- エラー率を90%削減

---
layout: image-center
---

# 製品イメージ

![製品画像](https://via.placeholder.com/800x450)

*新製品の外観デザイン*

---
layout: quote-slide
---

> シンプルは究極の洗練である

— レオナルド・ダ・ヴィンチ

---
layout: section-slide
---

# 第2章

技術的な詳細

---
layout: table-slide
---

# 価格比較

| 項目 | ベーシック | プレミアム | エンタープライズ |
|------|-----------|-----------|----------------|
| 価格 | ¥1,000 | ¥3,000 | お問い合わせ |
| ユーザー数 | 1 | 5 | 無制限 |
| ストレージ | 10GB | 100GB | 1TB |
| サポート | メール | 電話・メール | 専任担当 |

---
layout: code-slide
---

# 使用例

\`\`\`javascript
function createSlide(content) {
  const slide = new Slide(content);
  slide.render();
  return slide;
}

createSlide({ title: "Hello World" });
\`\`\`

---
layout: chart-slide
chart_type: bar
---

# 月別売上推移

labels: 1月, 2月, 3月, 4月, 5月, 6月
data: 12, 19, 15, 25, 22, 30
dataset_label: 売上（百万円）

---
layout: dual-chart-slide
---

# データ分析

## 市場シェア

chart_type: pie
labels: 製品A, 製品B, 製品C, 製品D
data: 30, 25, 25, 20

## 成長率

chart_type: line
labels: Q1, Q2, Q3, Q4
data: 15, 25, 35, 45
dataset_label: 成長率（%）

---
layout: chart-text-slide
chart_type: bar
---

# 売上分析

**グラフデータ:**
labels: 2019, 2020, 2021, 2022, 2023, 2024
data: 100, 120, 140, 180, 220, 280

**主要な発見:**
- 売上が前年比150%増加
- 新規顧客が大幅に増加
- リピート率が向上
- 市場シェアが拡大

この成長は、新製品の投入と積極的なマーケティング戦略によるものです。

---
layout: diff-slide
---

# 改善ポイント

## Before

- 処理時間が遅い（平均5秒）
- エラーが頻発（月10件）
- UIが使いにくい
- メモリ消費が大きい（500MB）

## After

- 処理速度が3倍向上（1.5秒）
- エラー率を90%削減（月1件）
- 直感的なUIに刷新
- メモリ使用量を50%削減（250MB）

---
layout: diff-slide
content_type: code
---

# コードリファクタリング

## Before

\`\`\`javascript
function getData() {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].active == true) {
      result.push(data[i]);
    }
  }
  return result;
}
\`\`\`

## After

\`\`\`javascript
function getData() {
  return data.filter(item => item.active);
}
\`\`\`

---
layout: oneline-slide
---

# Think Different

---
layout: oneline-slide
size: medium
---

# シンプルは究極の洗練である

— レオナルド・ダ・ヴィンチ

---
layout: oneline-slide
size: small
---

# 質問はありますか？

---
layout: full-image
background: https://via.placeholder.com/1920x1080
---

# インパクトのあるメッセージ

背景画像を使った印象的なスライド

---
layout: ending-slide
---

# ありがとうございました

ご清聴ありがとうございました

**お問い合わせ:**
- contact@example.com
- https://example.com
- @example_twitter

---

## 記述のコツ

1. **各レイアウトの仕様を確認**: `layout-specs.md`で推奨文字数を確認
2. **見出しは簡潔に**: 5-20文字程度
3. **箇条書きは3-5個**: 多すぎると読みにくい
4. **グラフは6-8データポイント**: 多すぎると見にくい
5. **コードは15行以内**: スライドに収まる範囲
