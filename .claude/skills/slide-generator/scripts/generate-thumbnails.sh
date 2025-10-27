#!/bin/bash

# サムネイル生成スクリプト

echo "🎨 スライドサムネイル生成ツール"
echo ""

# Puppeteerがインストールされているか確認
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "   brew install node でインストールしてください"
    exit 1
fi

# package.jsonの存在確認
if [ ! -f "package.json" ]; then
    echo "📦 package.jsonを作成しています..."
    npm init -y
fi

# Puppeteerのインストール確認
if [ ! -d "node_modules/puppeteer" ]; then
    echo "📦 Puppeteerをインストールしています（初回のみ）..."
    npm install puppeteer
fi

# vendorディレクトリの作成
VENDOR_DIR="slide-generator/resources/vendor"
mkdir -p "$VENDOR_DIR"

# CDNリソースのダウンロード（存在しない場合のみ）
echo ""
echo "📥 必要なリソースをダウンロードしています..."

if [ ! -f "$VENDOR_DIR/chart.min.js" ]; then
    echo "  • Chart.js をダウンロード中..."
    curl -sL https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js -o "$VENDOR_DIR/chart.min.js"
fi

if [ ! -f "$VENDOR_DIR/chartjs-plugin-datalabels.min.js" ]; then
    echo "  • Chart.js Datalabels プラグインをダウンロード中..."
    curl -sL https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js -o "$VENDOR_DIR/chartjs-plugin-datalabels.min.js"
fi

if [ ! -f "$VENDOR_DIR/prism.js" ]; then
    echo "  • Prism.js をダウンロード中..."
    curl -sL https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js -o "$VENDOR_DIR/prism.js"
fi

if [ ! -f "$VENDOR_DIR/prism.css" ]; then
    echo "  • Prism.css をダウンロード中..."
    curl -sL https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css -o "$VENDOR_DIR/prism.css"
fi

if [ ! -f "$VENDOR_DIR/prism-javascript.min.js" ]; then
    echo "  • Prism JavaScript コンポーネントをダウンロード中..."
    curl -sL https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js -o "$VENDOR_DIR/prism-javascript.min.js"
fi

echo ""
echo "📸 サムネイルを生成しています..."
echo ""

# sample-presentation.htmlのサムネイル生成
if [ -f "sample-presentation.html" ]; then
    node generate-thumbnails.js sample-presentation.html
fi

# layouts-example.htmlのサムネイル生成
if [ -f "slide-generator/resources/layouts-example.html" ]; then
    node generate-thumbnails.js slide-generator/resources/layouts-example.html
fi

# filipino-life-guide.htmlのサムネイル生成
if [ -f "filipino-life-guide.html" ]; then
    node generate-thumbnails.js filipino-life-guide.html
fi

echo ""
echo "✨ すべて完了しました！"
