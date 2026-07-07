// ---------- 九宮格 (Tic-Tac-Toe) ----------

const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

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

    const winLine = checkWinner();
    if (winLine) {
        gameOver = true;
        winLine.forEach(i => cells[i].classList.add('win'));
        statusEl.innerHTML = `<span class="turn-mark">${current}</span> 獲勝！`;
        cells.forEach(c => c.disabled = true);
        return;
    }

    if (state.every(v => v)) {
        gameOver = true;
        statusEl.textContent = '平手！';
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

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);

render();
updateStatus();
