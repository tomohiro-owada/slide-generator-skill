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

// Markdownをスライドに分割（frontmatterを考慮）
function splitSlides(text) {
  const blocks = [];
  const lines = text.split('\n');
  let currentBlock = [];
  let inFrontmatter = false;
  let frontmatterCount = 0;

  for (const line of lines) {
    if (line === '---') {
      if (!inFrontmatter) {
        // frontmatter開始
        inFrontmatter = true;
        frontmatterCount++;
        currentBlock.push(line);
      } else if (frontmatterCount === 1) {
        // frontmatter終了
        inFrontmatter = false;
        frontmatterCount++;
        currentBlock.push(line);
      } else {
        // スライド区切り
        if (currentBlock.length > 0) {
          blocks.push(currentBlock.join('\n'));
          currentBlock = [];
        }
        frontmatterCount = 0;
      }
    } else {
      currentBlock.push(line);
    }
  }

  // 最後のブロックを追加
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks.filter(block => block.trim());
}

const slideBlocks = splitSlides(markdown);

// 各スライドブロックをパース
function parseSlideBlock(block) {
  const lines = block.trim().split('\n');
  let layout = 'bullet-slide'; // デフォルトレイアウト
  let content = [];
  let backgroundImage = null;

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
    } else if (line === '---') {
      // frontmatter区切り
      continue;
    } else {
      content.push(line);
    }
  }

  return { layout, content: content.join('\n').trim(), backgroundImage };
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
    const { layout, content, backgroundImage } = slide;
    const htmlContent = markdownToHtml(content);

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
    <link rel="stylesheet" href="./.claude/skills/slide-generator/resources/styles.css">
    <link rel="stylesheet" href="./.claude/skills/slide-generator/resources/vendor/prism.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    <script src="./.claude/skills/slide-generator/resources/vendor/chart.min.js"></script>
    <script src="./.claude/skills/slide-generator/resources/vendor/chartjs-plugin-datalabels.min.js"></script>
    <script src="./.claude/skills/slide-generator/resources/vendor/prism.js"></script>
    <script src="./.claude/skills/slide-generator/resources/vendor/prism-javascript.min.js"></script>
</head>
<body>
${slidesHtml}

    <script src="./.claude/skills/slide-generator/resources/script.js"></script>
</body>
</html>`;
}

// メイン処理
try {
  console.log(`📖 Markdownファイルを読み込んでいます: ${inputFile}`);

  const slides = slideBlocks.map(parseSlideBlock);

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
