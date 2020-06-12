const ANIMATION_SPEED = 50;

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
        this.board.board[this.col][step] = this.player;
        this.board.board[this.col][step-1] = -1;
        this.board.redraw();

        if (step === this.row) {
          for (const cb of this.callbacks) cb(this);
        }
      }, step * ANIMATION_SPEED);
    }
  }
}

exports.Animation = Animation;
