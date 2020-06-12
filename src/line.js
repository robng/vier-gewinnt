const { COLS, ROWS } = require('./board');

class Line {
  constructor(board, col, row, player, directionX, directionY, length) {
    this.board = board;
    this.col = col;
    this.row = row;
    this.player = player;
    this.directionX = directionX;
    this.directionY = directionY;
    this.length = length;
  }

  getNextPos() {
    return {
      col: this.col + this.length * this.directionX,
      row: this.row + this.length * this.directionY
    }
  }

  isCompletable() {
    let completable = true;
    for (let step = this.length; step < 4; step++) {
      const nextCol = this.col + step * this.directionX;
      const nextRow = this.row + step * this.directionY;

      const invalid = (
        nextCol < 0 || nextCol >= COLS ||
        nextRow < 0 || nextRow >= ROWS
      );

      if (invalid) {
        completable = false;
        break;
      } else {
        const playerAtNextPos = this.board.board[nextCol][nextRow];
        if (playerAtNextPos !== -1 && playerAtNextPos !== this.player) {
          completable = false;
          break;
        } 
      }
    }

    return completable;
  }
}

exports.Line = Line;
