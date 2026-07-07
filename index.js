// ---------- 九宮格 (Tic-Tac-Toe) ----------

const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const bgm = document.getElementById('bgm');
const musicToggle = document.getElementById('musicToggle');
const sfxPlace = document.getElementById('sfxPlace');
const sfxWin = document.getElementById('sfxWin');
const sfxDraw = document.getElementById('sfxDraw');

function playSfx(audioEl) {
    audioEl.currentTime = 0; // 讓連續觸發時可以重新播放，不會卡住
    audioEl.play().catch(() => {
        // 找不到音效檔時安靜失敗即可，不影響遊戲進行
    });
}

const O_SVG = `<svg viewBox="0 0 100 100"><path d="M50 15 C72 15 85 32 84 52 C83 74 65 86 48 85 C28 84 15 68 16 48 C17 29 33 15 50 15 Z"/></svg>`;
const X_SVG = `<svg viewBox="0 0 100 100"><path d="M18 16 L83 82"/><path d="M82 18 L17 83"/></svg>`;

const WIN_LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let state = Array(9).fill(null);
let current = 'O'; // O goes first, matching the reference image
let gameOver = false;

function render() {
    cells.forEach((cell, i) => {
        cell.innerHTML = state[i] === 'O' ? O_SVG : state[i] === 'X' ? X_SVG : '';
        cell.disabled = Boolean(state[i]) || gameOver;
        cell.classList.remove('win');
    });
}

function checkWinner() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
            return line;
        }
    }
    return null;
}

function updateStatus() {
    if (gameOver) return;
    statusEl.innerHTML = `輪到 <span class="turn-mark">${current}</span>`;
}

function handleClick(e) {
    const cell = e.currentTarget;
    const index = Number(cell.dataset.index);

    if (gameOver || state[index]) return;

    state[index] = current;
    render();
    playSfx(sfxPlace);

    const winLine = checkWinner();
    if (winLine) {
        gameOver = true;
        winLine.forEach(i => cells[i].classList.add('win'));
        statusEl.innerHTML = `<span class="turn-mark">${current}</span> 獲勝！`;
        cells.forEach(c => c.disabled = true);
        playSfx(sfxWin);
        return;
    }

    if (state.every(v => v)) {
        gameOver = true;
        statusEl.textContent = '平手！';
        playSfx(sfxDraw);
        return;
    }

    current = current === 'O' ? 'X' : 'O';
    updateStatus();
}

function resetGame() {
    state = Array(9).fill(null);
    current = 'O';
    gameOver = false;
    render();
    updateStatus();
}

function toggleMusic() {
    if (bgm.paused) {
        bgm.play().catch(() => {
            // 找不到 bgm.mp3 或瀏覽器擋播放時會進到這裡
            alert('播放不了音樂，請確認 bgm.mp3 檔案是否存在同一資料夾。');
        });
        musicToggle.textContent = '🔊 播放中';
        musicToggle.classList.add('playing');
    } else {
        bgm.pause();
        musicToggle.textContent = '🔇 播放音樂';
        musicToggle.classList.remove('playing');
    }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
musicToggle.addEventListener('click', toggleMusic);

render();
updateStatus();
