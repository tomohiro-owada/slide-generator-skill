#!/bin/bash

# prepare-presentation.sh
# スライド生成後のデプロイ準備を自動化するスクリプト
#
# 使用方法:
#   bash .claude/skills/slide-generator/scripts/prepare-presentation.sh <html-file> <project-name>
#
# 例:
#   bash .claude/skills/slide-generator/scripts/prepare-presentation.sh climate-tech.html climate-tech
#
# 実行内容:
#   1. サムネイル生成（Puppeteer）
#   2. デプロイディレクトリ作成
#   3. HTMLとサムネイルをコピー
#   4. リソースファイルをコピー

set -e

# 引数チェック
if [ $# -ne 2 ]; then
    echo "使用方法: bash prepare-presentation.sh <html-file> <project-name>"
    echo "例: bash prepare-presentation.sh climate-tech.html climate-tech"
    exit 1
fi

HTML_FILE="$1"
PROJECT_NAME="$2"

# プロジェクトルートを取得（このスクリプトから相対）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
SKILL_DIR="$PROJECT_ROOT/.claude/skills/slide-generator"

echo "=========================================="
echo "スライドデプロイ準備"
echo "=========================================="
echo "HTMLファイル: $HTML_FILE"
echo "プロジェクト名: $PROJECT_NAME"
echo "プロジェクトルート: $PROJECT_ROOT"
echo "=========================================="

# HTMLファイルの存在確認
if [ ! -f "$PROJECT_ROOT/$HTML_FILE" ]; then
    echo "エラー: HTMLファイルが見つかりません: $PROJECT_ROOT/$HTML_FILE"
    exit 1
fi

# ステップ1: サムネイル生成
echo ""
echo "ステップ1: サムネイル生成"
echo "----------------------------------------"
cd "$PROJECT_ROOT"
node "$SKILL_DIR/scripts/generate-thumbnails.js" "$HTML_FILE"

# ステップ2: デプロイディレクトリ作成
echo ""
echo "ステップ2: デプロイディレクトリ作成"
echo "----------------------------------------"
DEPLOY_ROOT="$SKILL_DIR/deploy/abalol"
DEPLOY_DIR="$DEPLOY_ROOT/$PROJECT_NAME"
mkdir -p "$DEPLOY_DIR"
echo "作成: $DEPLOY_DIR"

# 共通リソースをルートにコピー（初回のみ）
if [ ! -d "$DEPLOY_ROOT/resources" ]; then
    cp -r "$SKILL_DIR/resources" "$DEPLOY_ROOT/resources"
    echo "共通リソースをコピー: $DEPLOY_ROOT/resources"
fi

# ステップ3: HTMLをコピー
echo ""
echo "ステップ3: HTMLファイルをコピー"
echo "----------------------------------------"
cp "$PROJECT_ROOT/$HTML_FILE" "$DEPLOY_DIR/index.html"
echo "コピー: $HTML_FILE → $DEPLOY_DIR/index.html"

# ステップ4: サムネイルをコピー
echo ""
echo "ステップ4: サムネイルをコピー"
echo "----------------------------------------"
THUMBNAIL_SOURCE="$PROJECT_ROOT/thumbnails/$(basename $HTML_FILE .html)"
if [ -d "$THUMBNAIL_SOURCE" ]; then
    cp -r "$THUMBNAIL_SOURCE" "$DEPLOY_DIR/thumbnails"
    echo "コピー: $THUMBNAIL_SOURCE → $DEPLOY_DIR/thumbnails"
else
    echo "警告: サムネイルディレクトリが見つかりません: $THUMBNAIL_SOURCE"
fi

# ステップ5: リソースファイルをコピー
echo ""
echo "ステップ5: リソースファイルをコピー"
echo "----------------------------------------"
# プロジェクトディレクトリにリソースをコピー
cp -r "$SKILL_DIR/resources" "$DEPLOY_DIR/resources"
echo "コピー: resources → $DEPLOY_DIR/resources"

# インデックスページを作成（初回のみ）
if [ ! -f "$DEPLOY_ROOT/index.html" ]; then
    cat > "$DEPLOY_ROOT/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentations</title>
    <link rel="stylesheet" href="resources/styles.css">
</head>
<body style="padding: 40px; max-width: 800px; margin: 0 auto;">
    <h1>プレゼンテーション一覧</h1>
    <ul id="project-list"></ul>
    <script>
        // プロジェクトディレクトリを自動検出して表示
        const projects = [];
        document.getElementById('project-list').innerHTML = projects.length === 0
            ? '<li>プロジェクトがまだありません</li>'
            : projects.map(p => `<li><a href="${p}/">${p}</a></li>`).join('');
    </script>
</body>
</html>
EOF
    echo "インデックスページを作成: $DEPLOY_ROOT/index.html"
fi

# 完了メッセージ
echo ""
echo "=========================================="
echo "デプロイ準備が完了しました！"
echo "=========================================="
echo ""
echo "次のステップ:"
echo "  1. ローカルで確認:"
echo "     open $DEPLOY_DIR/index.html"
echo ""
echo "  2. Surgeにデプロイ:"
echo "     cd $DEPLOY_ROOT"
echo "     surge . abalol.surge.sh"
echo ""
echo "  3. ブラウザで確認:"
echo "     open https://abalol.surge.sh/$PROJECT_NAME/"
echo "=========================================="
