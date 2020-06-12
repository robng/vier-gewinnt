const { writeFileSync } = require('fs');
const { Player } = require('./player');
const { Line } = require('./line');
const { COLS, ROWS } = require('./board');

class Ai extends Player {
  constructor(id, board) {
    super(id, board);
    this.moves = 0;
    this.lastCol = null;
    this.lastRow = null;
  }

  place() {
    const oldCursor = this.board.cursor;
    this.board.setCursor(this.findBestMove());
    const pos = super.place();

    if (this.board.animation) {
      this.board.animation.done(() => {
        this.board.setCursor(oldCursor);
        this.board.redraw();
      });
    }

    this.lastCol = pos.col;
    this.lastRow = pos.row;
    this.moves++;
    return pos;
  }

  findLine(col, row, directionX, directionY) {
    const player = this.board.board[col][row];
    let line;

    if (player !== -1) {

      let consecutive = 0;
      for (let step = 0; step < 4; step++) {
        const nextCol = col + step * directionX;
        const nextRow = row + step * directionY;
        
        const invalid = (
          nextCol < 0 || nextCol >= COLS ||
          nextRow < 0 || nextRow >= ROWS
        );
  
        if (invalid || this.board.board[nextCol][nextRow] !== player) {
          break;
        } else {
          consecutive++;
        }
      }
  
      line = new Line(this.board, col, row, player, directionX, directionY, consecutive);
    }

    return line;
  }

  findAllViableLines() {
    const lines = [];
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const possibleLines = [
          this.findLine(col, row,  1,  0), // check left
          this.findLine(col, row, -1,  0), // check right
          this.findLine(col, row,  0,  1), // check down
          this.findLine(col, row,  0, -1), // check up
          this.findLine(col, row,  1,  1), // check diagonally, going left and down
          this.findLine(col, row, -1,  1), // check diagonally, going right and down
          this.findLine(col, row,  1, -1), // check diagonally, going left and up
          this.findLine(col, row, -1, -1)  // check diagonally, going right and up
        ]

        for (const line of possibleLines) {
          if (line && line.isCompletable()) lines.push(line);
        }
      }
    }

    return lines;
  }

  findBestMove() {
    // default to a random col
    let col = Math.round(Math.random() * COLS);

    let willWinAt = -1;
    let needToObstructAt = -1;
    let canContinueAt = -1;
    let canObstructAt = -1;

    const lines = this.findAllViableLines(1);

    function replacer(k, v) {
      return k === 'board' ? null : v;
    }

    writeFileSync('lines.json', JSON.stringify(lines, replacer, 2));

    for (const line of lines) {
      const nextPos = line.getNextPos();
      const row = this.board.getRow(nextPos.col);

      if (nextPos.row === row) {
        if (line.length === 3 && line.player === this.id) willWinAt = nextPos.col;
        if (line.length === 3 && line.player !== this.id) needToObstructAt = nextPos.col;
        if (line.length < 3 && line.player === this.id) canContinueAt = nextPos.col;
        if (line.length < 3 && line.player === this.id) canObstructAt = nextPos.col;
      }
    }

    if (canObstructAt >= 0) col = canObstructAt;
    if (canContinueAt >= 0) col = canContinueAt;
    if (needToObstructAt >= 0) col = needToObstructAt;
    if (willWinAt >= 0) col = willWinAt;

    return col;
  }
}

exports.Ai = Ai;
