const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("current-player");
const statusDiv = document.getElementById("status");
const restartBtn = document.getElementById('restart');
const themeSelect = document.getElementById('themeSelect');
const scoreXText = document.getElementById('scoreX');
const scoreOText = document.getElementById('scoreO');

// تحميل الأصوات
const clickSound = new Audio('sounds/click1.mp3');
const winSound = new Audio('sounds/win.wav');
const drawSound = new Audio('sounds/lost.wav');

let currentPlayer = 'X';
let currentPlayer1 = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// نظام النقاط (في الذاكرة الحالية فقط)
let scores = { X: 0, O: 0 };
console.log(currentPlayer1)
// --- 1. نظام الألوان ---
const savedTheme = localStorage.getItem('theme') || 'dark-mode';
document.body.className = savedTheme;
themeSelect.value = savedTheme;

themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
});

// --- 2. التحقق من النتيجة ---
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            cells.forEach(cell => {
                cell.classList.add("active")
                if (Number(cell.dataset.index) === a){
                    cell.style.backgroundColor = "var(--accent)";
                }
                if (Number(cell.dataset.index) === b){
                    cell.style.backgroundColor = "var(--accent)";
                }
                if (Number(cell.dataset.index) === c){
                    cell.style.backgroundColor = "var(--accent)";
                }
            })
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        winSound.play(); // صوت الفوز
        statusDiv.innerText = `Congratulations! Player ${currentPlayer} Wins!`;
        scores[currentPlayer]++;
        updateScoreBoard();
        return;
    }

    if (!gameState.includes("")) {
        gameActive = false;
        drawSound.play(); // صوت التعادل
        statusDiv.innerText = "It's a Draw!";
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDiv.innerHTML = `Player Turn: <span id="current-player">${currentPlayer}</span>`;
}

function updateScoreBoard() {
    scoreXText.innerText = scores.X;
    scoreOText.innerText = scores.O;
}

// --- 3. الأحداث ---
cells.forEach((cell) => {
    cell.addEventListener("click", function () {
        const index = cell.dataset.index;
        if (gameState[index] !== "" || !gameActive) return;
        clickSound.currentTime = 0;
        clickSound.play(); // صوت الضغط
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkResult();
    });
});

restartBtn.addEventListener("click", function () {
    currentPlayer1 = currentPlayer1 === "X" ? "O" : "X";
    currentPlayer=currentPlayer1
    clickSound.currentTime = 0;
    clickSound.play();
    restartBtn.classList.add("clicked");
    setTimeout(() => restartBtn.classList.remove("clicked"), 150);
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.classList.remove("active")
        cell.textContent = "";
        cell.style.backgroundColor = "var(--cell-bg)";
    });
    // currentPlayer = currentPlayer === 'X'? "O" : "X";
    statusDiv.innerHTML = `Player Turn: <span id="current-player">${currentPlayer}</span>`;
});