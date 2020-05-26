const chalk = require('chalk');

const { Animation } = require('./animation');

const COLS = exports.COLS = 7;
const ROWS = exports.ROWS = 6;

const DEBUG = true;

const PLAYER_ICON = '⬤';
const CURSOR_ICON = 'v';

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
      console.log('cursor', this.cursor);
      console.log('player', global.debug.player);
      console.log('debug:', global.debug.msg || 'none')
      console.log();
    }
    this.printCursor();
    this.printBoard();
  }
}

exports.COLS = COLS;
exports.ROWS = ROWS;

exports.Board = Board;
