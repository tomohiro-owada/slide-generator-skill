// スライド操作
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let thumbnailView = null;

function showSlide(n) {
    slides.forEach((slide, index) => {
        slide.style.display = index === n ? 'flex' : 'none';
    });
}

document.addEventListener('keydown', (e) => {
    // サムネイル一覧が開いている場合、Escapeで閉じる
    if (e.key === 'Escape' && thumbnailView && thumbnailView.classList.contains('active')) {
        closeThumbnailView();
        return;
    }

    // Gキーでサムネイル一覧をトグル
    if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleThumbnailView();
        return;
    }

    // サムネイル一覧が開いている場合は、スライド操作をスキップ
    if (thumbnailView && thumbnailView.classList.contains('active')) {
        return;
    }

    if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
        updatePageNumber();
        updateProgressBar();
    } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
        updatePageNumber();
        updateProgressBar();
    } else if (e.key === 'Home') {
        currentSlide = 0;
        showSlide(currentSlide);
        updatePageNumber();
        updateProgressBar();
    } else if (e.key === 'End') {
        currentSlide = slides.length - 1;
        showSlide(currentSlide);
        updatePageNumber();
        updateProgressBar();
    }
});

// クリックで次のスライドへ
document.addEventListener('click', (e) => {
    // プログレスバーやサムネイル一覧など特定の要素をクリックした場合は除外
    if (!e.target.closest('.progress-bar') && !e.target.closest('.thumbnail-view')) {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
            updatePageNumber();
            updateProgressBar();
        }
    }
});

// 進捗バー（セグメント型）
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.appendChild(progressBar);

// スライド数分のセグメントを生成
const segments = [];
for (let i = 0; i < slides.length; i++) {
    const segment = document.createElement('div');
    segment.className = 'progress-segment';
    segment.addEventListener('click', (e) => {
        e.stopPropagation(); // クリックイベントの伝播を止める
        currentSlide = i;
        showSlide(currentSlide);
        updatePageNumber();
        updateProgressBar();
    });
    progressBar.appendChild(segment);
    segments.push(segment);
}

function updateProgressBar() {
    segments.forEach((segment, index) => {
        if (index <= currentSlide) {
            segment.classList.add('active');
        } else {
            segment.classList.remove('active');
        }
    });
}

// サムネイルツールチップ
const tooltip = document.createElement('div');
tooltip.className = 'thumbnail-tooltip';
const tooltipImg = document.createElement('img');
tooltip.appendChild(tooltipImg);
document.body.appendChild(tooltip);

// サムネイルパスを取得
// prepare-presentation.shで常にindex.htmlにリネームされるため、固定で'index'を使用
function getThumbnailPath(slideIndex) {
    return `thumbnails/index/slide-${slideIndex}.png`;
}

// セグメントにホバーイベント追加（事前生成されたサムネイルを使用）
segments.forEach((segment, index) => {
    segment.addEventListener('mouseenter', () => {
        const thumbnailPath = getThumbnailPath(index);
        tooltipImg.src = thumbnailPath;
        tooltipImg.onerror = () => {
            // サムネイルが見つからない場合は非表示
            tooltip.classList.remove('visible');
        };
        tooltipImg.onload = () => {
            tooltip.classList.add('visible');
        };
    });

    segment.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });

    segment.addEventListener('mousemove', (e) => {
        // ツールチップの位置を調整
        const tooltipWidth = 200;
        const tooltipHeight = 150;
        let left = e.clientX + 15;
        let top = e.clientY + 15;

        // 画面右端を超えないように調整
        if (left + tooltipWidth > window.innerWidth) {
            left = e.clientX - tooltipWidth - 15;
        }

        // 画面下端を超えないように調整
        if (top + tooltipHeight > window.innerHeight) {
            top = e.clientY - tooltipHeight - 15;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    });
});

// ページ番号表示
const pageNumber = document.createElement('div');
pageNumber.style.cssText = 'position: fixed; bottom: 20px; right: 20px; font-size: 1.2rem; color: #023047; opacity: 0.7; z-index: 1000;';
document.body.appendChild(pageNumber);

function updatePageNumber() {
    pageNumber.textContent = `${currentSlide + 1} / ${slides.length}`;
}

// サムネイル一覧表示機能
function createThumbnailView() {
    const view = document.createElement('div');
    view.className = 'thumbnail-view';

    const header = document.createElement('div');
    header.className = 'thumbnail-header';
    header.innerHTML = `
        <h3>スライド一覧 (${slides.length}枚)</h3>
        <div class="thumbnail-close">閉じる (Esc / G)</div>
    `;

    const grid = document.createElement('div');
    grid.className = 'thumbnail-grid';

    slides.forEach((slide, index) => {
        const item = document.createElement('div');
        item.className = 'thumbnail-item';
        if (index === currentSlide) {
            item.classList.add('current');
        }

        const preview = document.createElement('div');
        preview.className = 'thumbnail-preview';

        // サムネイル画像を使用（事前生成されたもの）
        const thumbnailPath = getThumbnailPath(index);
        const img = document.createElement('img');
        img.src = thumbnailPath;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        img.onerror = () => {
            // サムネイルが見つからない場合は、スライドのクローンを使用
            const clonedSlide = slide.cloneNode(true);
            clonedSlide.style.display = 'flex';
            preview.appendChild(clonedSlide);
        };
        preview.appendChild(img);

        const info = document.createElement('div');
        info.className = 'thumbnail-info';
        const slideTitle = slide.querySelector('h1, h2')?.textContent || `スライド ${index + 1}`;
        info.innerHTML = `
            <div class="thumbnail-number">${index + 1} / ${slides.length}</div>
            <div class="thumbnail-title">${slideTitle}</div>
        `;

        item.appendChild(preview);
        item.appendChild(info);

        item.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            updatePageNumber();
            updateProgressBar();
            closeThumbnailView();
        });

        grid.appendChild(item);
    });

    view.appendChild(header);
    view.appendChild(grid);
    document.body.appendChild(view);

    header.querySelector('.thumbnail-close').addEventListener('click', closeThumbnailView);

    return view;
}

function openThumbnailView() {
    if (!thumbnailView) {
        thumbnailView = createThumbnailView();
    } else {
        // 現在のスライドを更新
        document.querySelectorAll('.thumbnail-item').forEach((item, index) => {
            if (index === currentSlide) {
                item.classList.add('current');
            } else {
                item.classList.remove('current');
            }
        });
    }
    thumbnailView.classList.add('active');
}

function closeThumbnailView() {
    if (thumbnailView) {
        thumbnailView.classList.remove('active');
    }
}

function toggleThumbnailView() {
    if (thumbnailView && thumbnailView.classList.contains('active')) {
        closeThumbnailView();
    } else {
        openThumbnailView();
    }
}

// 初期化
// URLクエリパラメータからページ番号を取得（?p=1 形式）
const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('p');
if (pageParam) {
    const pageNum = parseInt(pageParam, 10);
    if (pageNum >= 1 && pageNum <= slides.length) {
        currentSlide = pageNum - 1; // 1始まりを0始まりに変換
    }
}
showSlide(currentSlide);
updatePageNumber();
updateProgressBar();
