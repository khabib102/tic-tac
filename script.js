const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const scoreXText = document.getElementById('scoreX');
const scoreOText = document.getElementById('scoreO');
const aiCheckbox = document.getElementById('aiCheckbox');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let scoreX = 0;
let scoreO = 0;
let aiEnabled = false;

const PLAYER_X_WON = 'PLAYER_X_WON';
const PLAYER_O_WON = 'PLAYER_O_WON';
const TIE = 'TIE';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.innerHTML = `${currentPlayer}'s turn`;
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.innerHTML = `${currentPlayer} has won!`;
        isGameActive = false;
        updateScore(currentPlayer);
        return;
    }

    let roundTie = !board.includes('');
    if (roundTie) {
        statusText.innerHTML = `Game ended in a tie!`;
        isGameActive = false;
        return;
    }

    handlePlayerChange();
    if (aiEnabled && currentPlayer === 'O') {
        handleAIMove();
    }
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleAIMove() {
    let availableCells = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    let aiMove = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[aiMove] = currentPlayer;
    cells[aiMove].innerHTML = currentPlayer;
    handleResultValidation();
}

function handleRestartGame() {
    isGameActive = true;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    statusText.innerHTML = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.innerHTML = '');
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        scoreXText.innerHTML = scoreX;
    } else {
        scoreO++;
        scoreOText.innerHTML = scoreO;
    }
}

aiCheckbox.addEventListener('change', () => {
    aiEnabled = aiCheckbox.checked;
    if (aiEnabled && currentPlayer === 'O') {
        handleAIMove();
    }
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);

statusText.innerHTML = `${currentPlayer}'s turn`;
