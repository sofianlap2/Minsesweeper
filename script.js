const board = [];
const rows = 8;
const cols = 8;

let cellClicked = 0;
const mineCords = [];
let flagEnabled = false;
let gameOver = false;
const minesCount = 10;

window.onload = function () {
  startGame();
};

function setMines() {
  let counter = 0
  while(counter < minesCount) {
    let randonRow = Math.floor(Math.random() * rows)
    let randoncol = Math.floor(Math.random() * cols)
    let id = randonRow.toString() + '-' + randoncol.toString()
    if(!mineCords.includes(id)) {
      mineCords.push(id)
      counter++
    }
  }
}

function startGame() {
  const boardContainer = document.getElementById("board");
  document.getElementById("flag-button").addEventListener("click", setFlag);
  document.querySelector("#mines-count").innerText = minesCount;
  setMines();

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.id = r.toString() + "-" + c.toString();
      cell.addEventListener("click", setCell);
      boardContainer.append(cell);
      row.push(cell);
    }
    board.push(row);
  }
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}

function setCell() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }
  const cell = this;

  if (flagEnabled) {
    if (cell.innerText == "") {
      cell.innerText = "🚩";
    } else if ((cell.innerText = "🚩")) {
      cell.innerText = "";
    }
    return
  }

  if (mineCords.includes(cell.id)) {
    revealMines();
    gameOver = true;
    alert("game over");
    return;
  }
  let rowCell = parseInt(cell.id[0]);
  let colCell = parseInt(cell.id[2]);

  countMine(rowCell, colCell);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellId = board[r][c].id;
      if (mineCords.includes(cellId)) {
        board[r][c].innerText = "💣";
        board[r][c].style.backgroundColor = "red";
      }
    }
  }
}

function countMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }
  board[r][c].classList.add("tile-clicked");
  cellClicked += 1;
  let counterMines = 0;

  for(let x = -1; x < 2; x++) {
    for(let y = -1; y < 2; y++) {
      if(x === 0 && c === 0) continue
      counterMines += checkMine(r+x, r+y);
    }
  }

  if (counterMines > 0) {
    board[r][c].innerText = counterMines;
    board[r][c].classList.add(`x${counterMines}`);
  } else {
    for(let h = -1; h < 2; h++) {
      for(let g = -1; g < 2; g++) {
        if(h === 0 && g === 0) continue
        countMine(r+h, c+g);
      }
    }
  }

  if (cellClicked === cols * rows - mineCords.length) {
    document.querySelector("#mines-count").innerText = "Cleared";
    gameOver = true;
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    return 0;
  }
  if (mineCords.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
