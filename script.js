class TicTacToe {
  constructor() {
    this.board = document.getElementById("game-board");
    this.messageElement = document.getElementById("message");
    this.resetButton = document.getElementById("reset-btn");
    this.newGameButton = document.getElementById("new-game-btn");
    this.currentPlayerElement = document.getElementById("current-player");
    this.xWinsElement = document.getElementById("x-wins");
    this.oWinsElement = document.getElementById("o-wins");

    this.currentPlayer = "X";
    this.gameState = Array(9).fill("");
    this.gameActive = true;
    this.xWins = 0;
    this.oWins = 0;

    this.winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    this.loadScores();
    this.initializeBoard();
    this.addEventListeners();
  }

  loadScores() {
    const savedX = localStorage.getItem("xWins");
    const savedO = localStorage.getItem("oWins");
    if (savedX) this.xWins = parseInt(savedX);
    if (savedO) this.oWins = parseInt(savedO);
    this.updateScoreDisplay();
  }

  saveScores() {
    localStorage.setItem("xWins", this.xWins);
    localStorage.setItem("oWins", this.oWins);
  }

  updateScoreDisplay() {
    this.xWinsElement.textContent = this.xWins;
    this.oWinsElement.textContent = this.oWins;
  }

  initializeBoard() {
    this.board.innerHTML = "";
    this.gameState.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-index", index);
      cell.addEventListener("click", (e) => this.handleCellClick(e, index));
      this.board.appendChild(cell);
    });
  }

  addEventListeners() {
    this.resetButton.addEventListener("click", () => this.resetGame());
    this.newGameButton.addEventListener("click", () => this.newGame());
  }

  handleCellClick(event, index) {
    const clickedCell = event.target;

    if (this.gameState[index] !== "" || !this.gameActive) {
      return;
    }

    this.gameState[index] = this.currentPlayer;
    clickedCell.textContent = this.currentPlayer;
    clickedCell.classList.add(this.currentPlayer.toLowerCase());

    if (this.checkWin()) {
      return;
    }

    if (this.checkDraw()) {
      this.endGame(true);
      return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.currentPlayerElement.textContent = this.currentPlayer;
  }

  checkWin() {
    for (const condition of this.winConditions) {
      const [a, b, c] = condition;
      if (
        this.gameState[a] &&
        this.gameState[a] === this.gameState[b] &&
        this.gameState[a] === this.gameState[c]
      ) {
        this.drawWinLine(condition);
        this.endGame(false);
        return true;
      }
    }
    return false;
  }

  checkDraw() {
    return !this.gameState.includes("");
  }

  drawWinLine([a, b, c]) {
    const cells = document.querySelectorAll(".cell");
    const cellA = cells[a];
    const cellC = cells[c];
    const boardRect = this.board.getBoundingClientRect();
    const rectA = cellA.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();

    const startX = rectA.left + rectA.width / 2 - boardRect.left;
    const startY = rectA.top + rectA.height / 2 - boardRect.top;
    const endX = rectC.left + rectC.width / 2 - boardRect.left;
    const endY = rectC.top + rectC.height / 2 - boardRect.top;

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
    
    // Extend the line
    const extendBy = 20; // Extend by 20px on each side
    const angleRad = (angle * Math.PI) / 180;
    
    const extendedStartX = startX - Math.cos(angleRad) * extendBy;
    const extendedStartY = startY - Math.sin(angleRad) * extendBy;
    
    // Total length includes the main length plus extension on both sides
    const fullLength = length + (extendBy * 2);

    const line = document.createElement("div");
    line.classList.add("win-line");
    line.style.setProperty("--length", `${fullLength}px`); 
    line.style.width = "0px"; 
    
    line.style.left = `${extendedStartX}px`;
    // Offset top by half height (3px) so the transform-origin (0, 50%) is exactly at (extendedStartX, extendedStartY)
    line.style.top = `${extendedStartY - 3}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = "0 50%"; // Rotate from the start point
    
    this.board.appendChild(line);
  }

  endGame(isDraw) {
    this.gameActive = false;
    this.messageElement.classList.add("show");
    document.querySelector(".player-turn").classList.add("hidden");

    if (isDraw) {
      this.messageElement.textContent = "It's a Draw!";
      this.messageElement.style.color = "#ffcc00"; // Draw color
    } else {
      this.messageElement.textContent = `Player ${this.currentPlayer} Wins!`;
      this.messageElement.style.color =
        this.currentPlayer === "X" ? "#ff4d4d" : "#4da6ff";

      if (this.currentPlayer === "X") {
        this.xWins++;
      } else {
        this.oWins++;
      }
      this.saveScores();
      this.updateScoreDisplay();
    }
  }

  resetGame() {
    this.gameState.fill("");
    this.gameActive = true;
    this.currentPlayer = "X";
    this.currentPlayerElement.textContent = this.currentPlayer;

    this.messageElement.textContent = "";
    this.messageElement.classList.remove("show");
    document.querySelector(".player-turn").classList.remove("hidden");

    // Clear win lines
    const winLine = this.board.querySelector(".win-line");
    if (winLine) winLine.remove();

    // Reset cells
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o");
    });
  }

  newGame() {
    this.xWins = 0;
    this.oWins = 0;
    this.saveScores();
    this.updateScoreDisplay();
    this.resetGame();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
