#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 使用方法を表示
function showUsage() {
  console.log(`
使用方法:
  node generate-slides.js <input.md> <output.html>

例:
  node generate-slides.js presentation.md presentation.html
`);
  process.exit(1);
}

// コマンドライン引数をチェック
if (process.argv.length < 4) {
  showUsage();
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

// 入力ファイルの存在確認
if (!fs.existsSync(inputFile)) {
  console.error(`エラー: 入力ファイルが見つかりません: ${inputFile}`);
  process.exit(1);
}

// Markdownファイルを読み込む
const markdown = fs.readFileSync(inputFile, 'utf-8');

// Markdownをスライドに分割
// frontmatter形式（--- layout: xxx ---）と通常の---区切りの両方に対応
function splitSlides(text) {
  const blocks = [];
  const lines = text.split('\n');
  let currentBlock = [];
  let inFrontmatter = false;
  let hasFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // frontmatterの開始を検出（次の行が layout: で始まる場合）
    if (line === '---' && !inFrontmatter && i + 1 < lines.length && lines[i + 1].startsWith('layout:')) {
      // 前のブロックがあれば保存
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
      inFrontmatter = true;
      hasFrontmatter = true;
      currentBlock.push(line);
    }
    // frontmatterの終了を検出
    else if (line === '---' && inFrontmatter) {
      currentBlock.push(line);
      inFrontmatter = false;
      hasFrontmatter = false;
      // frontmatterの後のコンテンツも同じブロックに含める
    }
    // 通常のスライド区切り（frontmatterでない---）
    else if (line === '---' && !inFrontmatter) {
      // 前のブロックがあれば保存
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
      // ---は区切りなので、ブロックには含めない
    }
    else {
      currentBlock.push(line);
    }
  }

  // 最後のブロックを追加
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks.map(b => b.trim()).filter(b => b);
}

const slideBlocks = splitSlides(markdown);

// 各スライドブロックをパース
function parseSlideBlock(block, index) {
  const lines = block.trim().split('\n');
  let layout = null;
  let content = [];
  let backgroundImage = null;
  let chartType = null;
  let chartData = null;

  // frontmatter形式のチェック
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // frontmatter（layout指定）を検出
    if (line === 'layout: title-slide') layout = 'title-slide';
    else if (line === 'layout: bullet-slide') layout = 'bullet-slide';
    else if (line === 'layout: two-column') layout = 'two-column';
    else if (line === 'layout: quote-slide') layout = 'quote-slide';
    else if (line === 'layout: three-column') layout = 'three-column';
    else if (line === 'layout: table-slide') layout = 'table-slide';
    else if (line === 'layout: code-slide') layout = 'code-slide';
    else if (line === 'layout: chart-slide') layout = 'chart-slide';
    else if (line === 'layout: oneline-slide') layout = 'oneline-slide';
    else if (line === 'layout: profile-slide') layout = 'profile-slide';
    else if (line === 'layout: image-center') layout = 'image-center';
    else if (line === 'layout: dual-chart-slide') layout = 'dual-chart-slide';
    else if (line === 'layout: chart-text-slide') layout = 'chart-text-slide';
    else if (line === 'layout: diff-slide') layout = 'diff-slide';
    else if (line === 'layout: full-image') layout = 'full-image';
    else if (line === 'layout: credits-slide') layout = 'credits-slide';
    else if (line.startsWith('layout:')) {
      // その他のlayout指定
      continue;
    } else if (line.startsWith('background-image:')) {
      // background-image指定を抽出
      backgroundImage = line.replace('background-image:', '').trim();
      continue;
    } else if (line.startsWith('chart-type:')) {
      // chart-type指定を抽出
      chartType = line.replace('chart-type:', '').trim();
      continue;
    } else if (line.startsWith('chart-data:')) {
      // chart-data指定を抽出
      chartData = line.replace('chart-data:', '').trim();
      continue;
    } else if (line === '---') {
      // frontmatter区切り
      continue;
    } else {
      content.push(line);
    }
  }

  const contentStr = content.join('\n').trim();

  // レイアウトが指定されていない場合、自動判定
  if (!layout) {
    // 最初のスライド
    if (index === 0) {
      layout = 'title-slide';
    }
    // テーブルを含む
    else if (contentStr.includes('|') && contentStr.match(/\|.*\|/)) {
      layout = 'table-slide';
    }
    // 引用を含む
    else if (contentStr.includes('>')) {
      layout = 'quote-slide';
    }
    // コードブロックを含む
    else if (contentStr.includes('```')) {
      layout = 'code-slide';
    }
    // 画像を含む
    else if (contentStr.includes('![')) {
      layout = 'image-center';
    }
    // 1行の短いテキストのみ（ワンライン）
    else if (lines.length <= 3 && !contentStr.includes('\n') && contentStr.length < 50) {
      layout = 'oneline-slide';
    }
    // デフォルト
    else {
      layout = 'bullet-slide';
    }
  }

  return { layout, content: contentStr, backgroundImage, chartType, chartData };
}

// Markdown記法をHTMLに変換（改良版）
function markdownToHtml(text) {
  // コードブロック（先に処理）
  const codeBlocks = [];
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code class="language-${lang || 'javascript'}">${escapeHtml(code.trim())}</code></pre>`);
    return placeholder;
  });

  // Markdownテーブル
  text = text.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rowsHtml = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('\n');
    return `<table>\n<thead>\n<tr>${headers}</tr>\n</thead>\n<tbody>\n${rowsHtml}\n</tbody>\n</table>`;
  });

  // 見出し
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 箇条書き
  text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul class="bullet-list">$&</ul>');

  // 引用
  text = text.replace(/^> (.+)$/gm, '<blockquote class="quote">$1</blockquote>');

  // 画像
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // リンク
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 太字
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 斜体
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 段落（HTMLタグの間には挿入しない）
  text = text.split('\n\n').map(para => {
    para = para.trim();
    // HTMLタグで始まる場合、または<script>タグを含む場合はそのまま
    if (para.startsWith('<') || para.includes('<script>') || para.includes('</script>') || para === '') {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');

  // コードブロックを復元
  codeBlocks.forEach((block, i) => {
    text = text.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return text;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// HTMLテンプレートを生成
function generateHtml(slides) {
  const slidesHtml = slides.map((slide, index) => {
    const { layout, content, backgroundImage, chartType, chartData } = slide;

    // 装飾要素
    const decorations = `
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
        </div>`;

    // background-imageがある場合はstyle属性を追加
    const styleAttr = backgroundImage ? ` style="background-image: url(${backgroundImage})"` : '';

    // chart-slideの場合は特別な処理
    let htmlContent;
    if (layout === 'chart-slide' && chartData) {
      const chartId = `chart-${index}`;
      htmlContent = `${markdownToHtml(content)}
        <div class="chart-container">
            <canvas id="${chartId}"></canvas>
        </div>
        <script>
        (function() {
            const ctx = document.getElementById('${chartId}').getContext('2d');
            const chartData = ${chartData};
            new Chart(ctx, {
                type: '${chartType || 'bar'}',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
        })();
        </script>`;
    } else {
      htmlContent = markdownToHtml(content);
    }

    return `
    <!-- ${index + 1}. ${layout} -->
    <section class="slide ${layout}"${styleAttr}>
${decorations}

        <div class="slide-content">
${htmlContent}
        </div>
    </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation</title>
    <link rel="stylesheet" href="resources/styles.css">
    <link rel="stylesheet" href="resources/vendor/prism.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    <script src="resources/vendor/chart.min.js"></script>
    <script src="resources/vendor/chartjs-plugin-datalabels.min.js"></script>
    <script src="resources/vendor/prism.js"></script>
    <script src="resources/vendor/prism-javascript.min.js"></script>
</head>
<body>
${slidesHtml}

    <script src="resources/script.js"></script>
</body>
</html>`;
}

// メイン処理
try {
  console.log(`📖 Markdownファイルを読み込んでいます: ${inputFile}`);

  const slides = slideBlocks.map((block, index) => parseSlideBlock(block, index));

  console.log(`✅ ${slides.length}枚のスライドを検出しました`);

  const html = generateHtml(slides);

  fs.writeFileSync(outputFile, html, 'utf-8');

  console.log(`✨ HTMLファイルを生成しました: ${outputFile}`);
  console.log(`\n次のステップ:`);
  console.log(`  bash .claude/skills/slide-generator/scripts/prepare-presentation.sh ${outputFile} presentation-name`);
} catch (error) {
  console.error('エラーが発生しました:', error.message);
  process.exit(1);
}
