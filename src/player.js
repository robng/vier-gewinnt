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

exports.Player = Player;
