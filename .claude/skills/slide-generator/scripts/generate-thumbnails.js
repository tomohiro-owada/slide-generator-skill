#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generateThumbnails(htmlFile) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // ビューポートサイズを設定（スライドサイズに合わせる）
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });

    // HTMLファイルを開く
    const filePath = path.resolve(htmlFile);
    await page.goto(`file://${filePath}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    // 追加で少し待つ（Chart.jsなどの初期化を待つ）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // スライド数を取得
    const slideCount = await page.evaluate(() => {
        return document.querySelectorAll('.slide').length;
    });

    console.log(`📸 ${slideCount}枚のスライドを検出しました`);

    // サムネイル保存ディレクトリ
    const thumbnailDir = path.join(path.dirname(filePath), 'thumbnails', path.basename(htmlFile, '.html'));
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    // 各スライドのサムネイルを生成
    for (let i = 0; i < slideCount; i++) {
        console.log(`  📷 スライド ${i + 1}/${slideCount} を処理中...`);

        // スライドを表示
        await page.evaluate((index) => {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((slide, idx) => {
                slide.style.display = idx === index ? 'flex' : 'none';
            });
        }, i);

        // 少し待つ（グラフなどのレンダリングを待つ）
        await new Promise(resolve => setTimeout(resolve, 500));

        // スクリーンショット撮影
        const screenshotPath = path.join(thumbnailDir, `slide-${i}.png`);
        await page.screenshot({
            path: screenshotPath,
            fullPage: false
        });
    }

    await browser.close();

    console.log(`✅ 完了！サムネイルは ${thumbnailDir} に保存されました`);
}

// コマンドライン引数からHTMLファイルを取得
const htmlFile = process.argv[2];

if (!htmlFile) {
    console.error('使い方: node generate-thumbnails.js <htmlファイル>');
    process.exit(1);
}

generateThumbnails(htmlFile).catch(error => {
    console.error('エラー:', error);
    process.exit(1);
});
