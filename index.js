const readline = require('readline');

const COLS = 7;
const ROWS = 6;

const X_AXIS_LEFT  = -1;
const X_AXIS_SAME  =  0;
const X_AXIS_RIGHT =  1;

const Y_AXIS_UP    = -1;
const Y_AXIS_SAME  =  0;
const Y_AXIS_DOWN  =  1;

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

  isLineOfFour(col, row, directionX, directionY) {
    const player = this.board[col][row];

    let lineOfFour = true;
    for (let steps = 0; steps < 4; steps++) {
      const nextCol = col + steps * directionX;
      const nextRow = row + steps * directionY;

      const invalid = (
        nextCol < 0 || nextCol >= COLS ||
        nextRow < 0 || nextRow >= ROWS
      );

      if (invalid || this.board[nextCol][nextRow] !== player) lineOfFour = false;
    }
  
    return lineOfFour;
  }

  print() {
    let printedStr = '';

    for (let row = 0; row < ROWS; row++) {
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

/**
 * Places a piece on the board and returns whether
 * the move was the winning move.
 */
function place(board, col, player) {
  // place a piece in the given column
  // the row the piece was placed in will be returned
  const row = board.place(col, player);

  // piece was not placed
  if (row === -1)
    return false;

  // return whether or not the player
  // has won
  return (
    board.isLineOfFour(col, row, X_AXIS_LEFT, Y_AXIS_SAME) ||   // line to the left
    board.isLineOfFour(col, row, X_AXIS_RIGHT, Y_AXIS_SAME) ||  // line to the right
    board.isLineOfFour(col, row, X_AXIS_SAME, Y_AXIS_UP) ||     // line up
    board.isLineOfFour(col, row, X_AXIS_SAME, Y_AXIS_DOWN) ||   // line down
    board.isLineOfFour(col, row, X_AXIS_LEFT, Y_AXIS_UP) ||     // diagonal line going left, up
    board.isLineOfFour(col, row, X_AXIS_LEFT, Y_AXIS_DOWN) ||   // diagonal line going left, down
    board.isLineOfFour(col, row, X_AXIS_RIGHT, Y_AXIS_UP) ||    // diagonal line going right, up
    board.isLineOfFour(col, row, X_AXIS_RIGHT, Y_AXIS_DOWN)     // diagonal line going right, down
  );
}

let col = 0;
let player = 0;
let gameOver = false;

const board = new Board();
console.log('Press any key to start');

// prepare terminal for keypress-based user input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  // let the user exit the program using
  // ctrl-c or ctrl-d
  if ((key.name === 'c' && key.ctrl) || (key.name === 'd' && key.ctrl))
    process.exit(0);

  if (!gameOver) {
    if (key.name === 'left' && col > 0) col--;
    if (key.name === 'right' && col < COLS - 1) col++;
  
    let winningMove;
    if (key.name === 'space') {
      winningMove = place(board, col, player);
      player = player ? 0 : 1; // alternate between players
    }
  
    if (winningMove) {
      console.clear();
      console.log('Player ' + player + ' won the game!');
      gameOver = true;
    } else {
      redraw();
    }
  }
});

function redraw() {
  console.clear();
  console.log('col', col);
  console.log('ply', player);
  console.log();

  const cursor = 'v'.padStart(2 + col * 2, ' ');
  console.log(cursor);

  board.print();
}
