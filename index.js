const readline = require('readline');
const chalk = require('chalk');

const DEBUG = true;

const COLS = 7;
const ROWS = 6;

const PLAYER_ICON = '⬤';
const CURSOR_ICON = 'v';

let debugmsg;

class Board {

  /**
   * Board constructor
   * Initializes the board with empty cells
   */
  constructor() {
    this.board = [];
    this.cursor = 0;
    this.animations = [];

    for (let col = 0; col < COLS; col++) {
      this.board[col] = [];

      for (let row = 0; row < ROWS; row++) {
        this.board[col][row] = -1;
      }
    }
  }

  moveCursor(amount) {
    if (amount < 0) {
      this.cursor = (this.cursor + amount) >= 0
        ? this.cursor + amount
        : 0;
    }
    if (amount > 0) {
      this.cursor = (this.cursor + amount) < COLS
        ? this.cursor + amount
        : COLS - 1;
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
      this.animation = new Animation(this, col, firstEmptyRow, player);
      this.animation.done(() => {
        this.board[col][firstEmptyRow] = player;
        this.animation = null;
      });

      this.animation.run();
    }

    return firstEmptyRow;
  }

  isLineOfFour(col, row, directionX, directionY) {
    const player = this.board[col][row];

    let consecutive = 0;
    let lineOfFour = false;

    for (let steps = -4; steps < 4; steps++) {
      const nextCol = col + steps * directionX;
      const nextRow = row + steps * directionY;

      const invalid = (
        nextCol < 0 || nextCol >= COLS ||
        nextRow < 0 || nextRow >= ROWS
      );

      if (invalid || this.board[nextCol][nextRow] !== player) {
        consecutive = 0;
      } else {
        if (++consecutive === 4) {
          lineOfFour = true;
        }
      }
    }
  
    return lineOfFour;
  }

  printCursor() {
    console.log(CURSOR_ICON.padStart(2 + this.cursor * 2, ' '));
  }

  printBoard() {
    let printedStr = '';

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const value = this.board[col][row];
        // printedStr += chalk.bgBlue(' ');
        printedStr += ' ';

        if (value === -1) {
          printedStr += ' ';
          // printedStr += chalk.bgBlue(chalk.white(PLAYER_ICON))
        } else {
          printedStr += value
            ? chalk.yellow(PLAYER_ICON) // chalk.bgBlue(chalk.yellow(PLAYER_ICON))
            : chalk.red(PLAYER_ICON) // chalk.bgBlue(chalk.red(PLAYER_ICON))
        }
      }
      // printedStr += chalk.bgBlue('  \n');
      printedStr += '\n';
    }
    console.log(printedStr);
  }

  redraw() {
    console.clear();
    if (DEBUG) {
      console.log('player', player);
      console.log('cursor', board.cursor);
      console.log('debug:', debugmsg || 'none')
      console.log();
    }
    this.printCursor();
    this.printBoard();
  }
}

class Animation {
  constructor(board, col, row, player) {
    this.board = board;
    this.col = col;
    this.row = row;
    this.player = player;
    this.callbacks = [];
  }

  done(cb) {
    this.callbacks.push(cb);
  }

  run() {
    for (let step = 0; step <= this.row; step++) {
      setTimeout(() => {
        this.board.board[this.col][step] = player;
        this.board.board[this.col][step-1] = -1;
        this.board.redraw();

        if (step === this.row) {
          for (const cb of this.callbacks) cb(this);
        }
      }, step * 100);
    }
  }
}

class Player {
  constructor(id, board) {
    this.id = id;
    this.board = board;
  }

  /**
   * Places a piece on the board and returns whether
   * the move was the winning move.
   */
  place() {
    // place a piece in the given column
    // the row the piece was placed in will be returned
    const col = this.board.cursor;
    const row = this.board.place(col, this.id);

    // piece was not placed
    if (row === -1)
      return null;

    return { col, row };
  }
}

const board = new Board();
const players = [
  new Player(0, board),
  new Player(1, board)
];

let player = 0;
console.log('Press any key to start'); 

// prepare terminal for keypress-based user input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', async (str, key) => {
  // let the user exit the program using
  // ctrl-c or ctrl-d
  if ((key.name === 'c' && key.ctrl) || (key.name === 'd' && key.ctrl))
    process.exit(0);

  if (key.name === 'left') board.moveCursor(-1);
  if (key.name === 'right') board.moveCursor(1);

  if (key.name === 'space') {
    const pos = await players[player].place();
    if (pos && board.animation) {
      const { col, row } = pos;
      board.animation.done(() => {
        const winningMove = (
          board.isLineOfFour(col, row,  1, 0) || // check left and right
          board.isLineOfFour(col, row,  0, 1) || // check up and down
          board.isLineOfFour(col, row,  1, 1) || // check diagonally, left to right (up and down)
          board.isLineOfFour(col, row, -1, 1)    // check diagonally, right to left (up and down)
        );
  
        player = player ? 0 : 1; // alternate between players
      
        if (winningMove) {
          process.exit();
        }
      });
    }
  }

  board.redraw();
});
