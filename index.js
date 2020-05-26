const readline = require('readline');

const { Board } = require('./src/board');
const { Player } = require('./src/player');

global.debug = {};

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
        global.debug.player = player;

        if (winningMove) {
          process.exit();
        }
      });
    }
  }

  board.redraw();
});
