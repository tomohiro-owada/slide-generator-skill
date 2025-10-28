#!/bin/bash

# 色付きログ用の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 使い方を表示
usage() {
    echo "使い方: $0 <HTMLファイル> <スライド名>"
    echo ""
    echo "例: $0 sample-presentation.html my-presentation"
    echo "    → deploy/my-presentation/ に出力"
    echo ""
    echo "複数のスライドを追加:"
    echo "    $0 slide1.html project-a"
    echo "    $0 slide2.html project-b"
    echo "    → deploy/ 以下に複数のスライドを配置"
    echo ""
    exit 1
}

# 引数チェック
if [ $# -ne 2 ]; then
    echo -e "${RED}エラー: 引数が不足しています${NC}"
    usage
fi

HTML_FILE=$1
SLIDE_NAME=$2

# HTMLファイルの存在チェック
if [ ! -f "$HTML_FILE" ]; then
    echo -e "${RED}エラー: HTMLファイルが見つかりません: $HTML_FILE${NC}"
    exit 1
fi

# HTMLファイル名（拡張子なし）を取得
HTML_BASENAME=$(basename "$HTML_FILE" .html)

# 出力先ディレクトリ
DEPLOY_DIR="deploy"
SLIDE_DIR="$DEPLOY_DIR/$SLIDE_NAME"

echo -e "${BLUE}📦 プレゼンテーション準備ツール${NC}"
echo ""
echo -e "HTMLファイル: ${GREEN}$HTML_FILE${NC}"
echo -e "スライド名: ${GREEN}$SLIDE_NAME${NC}"
echo -e "出力先: ${GREEN}$SLIDE_DIR${NC}"
echo ""

# deployディレクトリを作成
mkdir -p "$DEPLOY_DIR"

# resources を deploy 直下にコピー（毎回更新）
echo -e "${YELLOW}📚 共通リソースを更新しています...${NC}"
if [ -d "resources" ]; then
    cp -r resources "$DEPLOY_DIR/"
    echo -e "${GREEN}  ✓ resources をコピーしました${NC}"
else
    echo -e "${RED}  ✗ resources が見つかりません${NC}"
    exit 1
fi

# スライドディレクトリを作成
echo -e "${YELLOW}📁 スライドディレクトリを作成しています...${NC}"
mkdir -p "$SLIDE_DIR"

# HTMLファイルをコピーしてindex.htmlにリネーム
echo -e "${YELLOW}📄 HTMLファイルをコピーしています...${NC}"
cp "$HTML_FILE" "$SLIDE_DIR/index.html"

# HTMLファイル内のパスを相対パスに修正
echo -e "${YELLOW}🔧 パスを調整しています...${NC}"
sed -i.bak 's|\./\.claude/skills/slide-generator/resources/|../resources/|g' "$SLIDE_DIR/index.html"
sed -i.bak 's|\.claude/skills/slide-generator/resources/|../resources/|g' "$SLIDE_DIR/index.html"
rm "$SLIDE_DIR/index.html.bak"
echo -e "${GREEN}  ✓ パスを相対パスに変更しました${NC}"

# サムネイルを生成
echo ""
echo -e "${YELLOW}📸 サムネイルを生成しています...${NC}"

# node_modulesが存在しない場合はインストール
if [ ! -d "node_modules/puppeteer" ]; then
    echo -e "${YELLOW}📥 Puppeteerをインストールしています...${NC}"
    npm install --silent puppeteer
fi

# generate-thumbnails.jsが存在するか確認
if [ ! -f "scripts/generate-thumbnails.js" ]; then
    echo -e "${RED}エラー: scripts/generate-thumbnails.js が見つかりません${NC}"
    exit 1
fi

# サムネイルを生成（スライドディレクトリで実行）
cd "$SLIDE_DIR"
SCRIPT_PATH="../../scripts/generate-thumbnails.js"
node "$SCRIPT_PATH" "index.html"
cd - > /dev/null

# サムネイルが生成されたか確認
if [ -d "$SLIDE_DIR/thumbnails/index" ]; then
    echo -e "${GREEN}  ✓ サムネイルを生成しました${NC}"
else
    echo -e "${YELLOW}  ⚠ サムネイルの生成をスキップしました${NC}"
fi

# 完了メッセージ
echo ""
echo -e "${GREEN}✨ 準備完了！${NC}"
echo ""
echo -e "スライドの場所: ${BLUE}$SLIDE_DIR${NC}"
echo ""
echo "次のステップ:"
echo "  1. ブラウザで確認:"
echo -e "     ${BLUE}open $SLIDE_DIR/index.html${NC}"
echo ""
echo "  2. 他のスライドを追加:"
echo -e "     ${BLUE}./prepare-presentation.sh another.html another-name${NC}"
echo ""
echo "  3. デプロイ:"
echo -e "     ${BLUE}cd deploy && surge${NC}"
echo -e "     または: ${BLUE}cd deploy && netlify deploy --prod${NC}"
echo ""
