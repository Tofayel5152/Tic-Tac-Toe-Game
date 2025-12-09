document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const currentPlayerElement = document.getElementById("current-player");
  const messageElement = document.getElementById("message");
  const resetButton = document.getElementById("reset-btn");
  const newGameButton = document.getElementById("new-game-btn");
  const xWinsElement = document.getElementById("x-wins");
  const oWinsElement = document.getElementById("o-wins");

  let currentPlayer = "X";
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;
  let xWins = 0;
  let oWins = 0;

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function initializeBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-index", i);
      cell.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cell);
    }

    document.querySelectorAll(".win-line").forEach((line) => line.remove());
  }

  function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[cellIndex] !== "" || !gameActive) {
      return;
    }

    gameState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    const winningCombo = checkWin();
    if (winningCombo) {
      drawWinLine(winningCombo);
      endGame(false);
    } else if (checkDraw()) {
      endGame(true);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      currentPlayerElement.textContent = currentPlayer;
    }
  }

  function checkWin() {
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        gameState[a] &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c]
      ) {
        return winConditions[i];
      }
    }
    return null;
  }

  function drawWinLine([a, b, c]) {
    const cells = document.querySelectorAll(".cell");
    const cellA = cells[a];
    const cellC = cells[c];

    const boardRect = gameBoard.getBoundingClientRect();
    const rectA = cellA.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();

    const startX = rectA.left + rectA.width / 2 - boardRect.left;
    const startY = rectA.top + rectA.height / 2 - boardRect.top;
    const endX = rectC.left + rectC.width / 2 - boardRect.left;
    const endY = rectC.top + rectC.height / 2 - boardRect.top;

    const length = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

    const line = document.createElement("div");
    line.classList.add("win-line");
    line.style.width = `${length}px`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}deg)`;

    gameBoard.appendChild(line);
  }

  function checkDraw() {
    return !gameState.includes("");
  }

  function endGame(isDraw) {
    gameActive = false;

    if (isDraw) {
      messageElement.textContent = "Game ended in a draw!";
      messageElement.classList.add("draw");
    } else {
      messageElement.textContent = `Player ${currentPlayer} wins!`;
      messageElement.classList.add("win");

      if (currentPlayer === "X") {
        xWins++;
        xWinsElement.textContent = xWins;
      } else {
        oWins++;
        oWinsElement.textContent = oWins;
      }
    }
  }

  function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    currentPlayerElement.textContent = currentPlayer;
    messageElement.textContent = "";
    messageElement.classList.remove("win", "draw");

    initializeBoard();
  }

  function newGame() {
    xWins = 0;
    oWins = 0;
    xWinsElement.textContent = xWins;
    oWinsElement.textContent = oWins;
    resetGame();
  }

  resetButton.addEventListener("click", resetGame);
  newGameButton.addEventListener("click", newGame);

  initializeBoard();
});
