const {
  EMPTY,
} = require('../constants');

// function for generate board
function generateBoard(matrix) {
  let board = [];
  for (let i = 0; i < matrix; i++) {
    board[i] = [];
    for (let j = 0; j < matrix; j++) {
      board[i][j] = EMPTY;
    }
  }
  return board;
}

/**
 * Represents a Connect 4 board as 2-D array
 */
class Board {
  constructor(matrix) {
    this.board = generateBoard(matrix);
    this.matrix = matrix;
  }

  /**
   * return a board
   */
  getBoard() {
    let board = [];
    for (let i = 0; i < this.board.length; i++) {
      board[i] = this.board[i].slice(0);
    }
    return board;
  }

  /**
   * Drop a token into a board column. If no more space in the
   * column, no token will be added
   * @param {number} column - the column index
   * @param {number} tokenColor - either RED or BLUE
   * @returns {boolean} true if token was added, false otherwise
   */
  addToken(column, tokenColor) {
    for (let row = this.matrix - 1; row >= 0; row--) {
      if (this.board[row][column] === EMPTY) {
        this.board[row][column] = tokenColor;
        return true;
      }
    }
    return false;
  }

  /**
   * Check for game end condition. Connect 4 would involve last played
   * @param {number} column - column
   * @returns {boolean} true if board has a winning result
   */
  checkForWin(column) {
    // already know column of last piece played,
    // i.e. the highest piece in the played column
    let row;
    for (row = 0; this.board[row][column] === EMPTY && row < this.matrix; row++) { }
      return this.checkForHorizontalWin(row, column) ||
        this.checkForVerticalWin(row, column) ||
        this.checkForDiagonalWin(row, column);
  }

  /**
   * Only need to check that top row is full since tokens stack
   * @returns {boolean} true if the game is a tie
   */
  checkForTie() {
    let topRow = this.board[0];
    return topRow.indexOf(EMPTY) === -1;
  }

  /**
   * Iterate over board row where last piece was dropped
   * check for 4 consecutive pieces of the same color
   * @param {number} row - row
   * @param {number} column - column
   * @returns {boolean} true if 4 consecutive pieces
   */
  checkForHorizontalWin(row, column) {
    let color = this.board[row][column];
    let winningString = [color, color, color, color].join('');
    let stringRow = this.board[row].join('');
    console.log(stringRow);
    return stringRow.indexOf(winningString) !== -1;
  }

  /**
   * Iterate over column where last piece was dropped
   * check for 4 consecutive pieces of the same color
   * @param {number} row - row
   * @param {number} column - column
   * @returns {boolean} true if 4 consecutive pieces
   */
  checkForVerticalWin(row, column) {
    console.log('Row number: ' + row);
    let color = this.board[row][column];
    return ((row + 3) < this.matrix) &&
      this.board[row][column] === color &&
      this.board[row+1][column] === color &&
      this.board[row+2][column] === color &&
      this.board[row+3][column] === color;
   }

  /**
   * check peices diagonally
   * @param {number} row - row
   * @param {number} column - column
   * @returns {boolean} true if 4 consecutive pieces
   */
  checkForDiagonalWin(row, column) {
    let color = this.board[row][column];
    let winningString = [color, color, color, color].join('');

    let NWCorner = {
      row: row - Math.min(row, column),
      column: column - Math.min(row, column)
    }
    let NECorner = {
      row: row - Math.min(row, (this.matrix - 1) - column),
      column: column + Math.min(row, (this.matrix - 1) - column)
    }
    let i, j;
    let NWtoSE = [];
    for (i = NWCorner.row, j = NWCorner.column; i < this.matrix && j < this.matrix; i++, j++) {
      NWtoSE.push(this.board[i][j]);
    }
    NWtoSE = NWtoSE.join('');
    if (NWtoSE.indexOf(winningString) !== -1) {
      return true;
    }

    let NEtoSW = [];
    for (i = NECorner.row, j = NECorner.column; i < this.matrix && j >= 0; i++, j--) {
      NEtoSW.push(this.board[i][j]);
    }
    NEtoSW = NEtoSW.join('');
    if (NEtoSW.indexOf(winningString) !== -1) {
      return true;
    }
    return false;
  }
}

module.exports = Board;