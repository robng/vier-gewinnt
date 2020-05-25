const COLS = 7;
const ROWS = 6;

class Board {

  /**
   * Board constructor
   * Initializes the board with empty cells
   */
  constructor() {
    this.board = [];

    for (let col = 0; col < COLS; col++) {
      this.board[col] = [];
      
      for (let row = 0; row < ROWS; row++) {
        this.board[col][row] = -1;
      }
    }
  }

  place(col, player) {
    let firstEmptyRow = -1;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (this.board[col][row] === -1) {
        firstEmptyRow = row;
        break;
      }
    }

    if (firstEmptyRow > -1) {
      this.board[col][firstEmptyRow] = player;
    }

    return firstEmptyRow;
  }

  //   0 1 2 3 4 5 6
  // 0  
  // 1    
  // 2 x     
  // 3 o x       
  // 4 o o x
  // 5 o o o x

  hasWon(col, row, directionX, directionY) {
    const player = this.board[col][row];

    let won = true;
    for (let steps = 0; steps < 4; steps++) {
      const nextCol = col + steps * directionX;
      const nextRow = row + steps * directionY;
      console.log(player, nextCol, nextRow);
      if (this.board[nextCol][nextRow] !== player) won = false;
    }
  
    return won;
  }

  // findWinner() {
  //   return -1;
  // }

  print() {
    let printedStr = '';

    for (let row = 0; row < ROWS; row++) {
      printedStr += row;
      printedStr += ' ';

      for (let col = 0; col < COLS; col++) {
        const value = this.board[col][row];
        printedStr += ' ';
        printedStr += (value === -1 ? ' ' : (value ? 'x' : 'o'));
      }
      printedStr += '\n';
    }
    console.log(printedStr);
  }
}

const board = new Board();

board.place(0, 0);
board.place(0, 0);
board.place(0, 0);
board.place(0, 1);

board.place(1, 0);
board.place(1, 0);
board.place(1, 1);

board.place(2, 0);
board.place(2, 1);

console.log(place(board, 3, 1));

board.print();

function place(board, col, player) {
  const row = board.place(col, player);

  if (row === -1)
    return false;

  return (
    board.hasWon(col, row, -1,  0) ||
    board.hasWon(col, row,  1,  0) ||
    board.hasWon(col, row,  0, -1) ||
    board.hasWon(col, row,  0,  1) ||
    board.hasWon(col, row, -1, -1) ||
    board.hasWon(col, row, -1,  1) ||
    board.hasWon(col, row,  1, -1) ||
    board.hasWon(col, row,  1,  1)
  );
}

// function tick() {
//   const winner = board.findWinner();
//   if (winner !== -1) {
//     console.log((winner ? 'x' : 'o') + ' has won');
//     shutdown();
//   }
// }

// function draw() {
//   console.clear();
//   board.print();
// }

// const interval = setInterval(() => {
//   tick();
//   draw();
// }, 50);

// function shutdown() {
//   clearInterval(interval);
//   console.log('Thanks for playing');
// }
