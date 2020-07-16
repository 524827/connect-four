const {
  RED,
  BLUE
} = require('../constants');

class Game {

  constructor(player1Id, player2Id, board) {
    if (player1Id === player2Id) {
      throw new Error('Players cannot have same id');
    }
    this.playerRed = player1Id;
    this.playerBlue = player2Id;
    this.playerActive = player1Id;
    this.gameTied = false;
    this.gameOver = false;
    this.winner = false;
    this.board = board;
  }

  /**
   * Toggle the active player
   */
  nextTurn() {
    if (this.playerActive === this.playerRed) {
      this.playerActive = this.playerBlue;
    } else {
      this.playerActive = this.playerRed;
    }
  }

  /**
   * Given a player in the game, return the other player
   * @param {string} player - id of a player in the game
   * @returns {string} the opponent
   */
  getOpponent(player) {
    if (player === this.playerBlue) {
      return this.playerRed;
    } else {
      return this.playerBlue;
    }
  }

  /**
   * Player drops a token into a column
   * @param {string} player - player id for player making the move
   * @param {number} column - column where token is dropped
   */
  move(player, column) {
    if (player === this.playerActive && !this.gameOver) {
      let tokenColor = (this.playerActive === this.playerRed) ? RED : BLUE;
      let success = this.board.addToken(column, tokenColor);
      if (success) {
        this.gameTied = this.board.checkForTie();
        this.gameOver = this.board.checkForWin(column);
        this.winner = this.playerActive;
        this.nextTurn();
      }
    }
  }

  /**
   * Dump the game state into an object
   * @param {string} player - id of player requesting the game state object
   * @returns {object} the current game state for the requesting player
   */
  getGameStateForPlayer(playerId, playerName) {
    console.log(playerName);
    let status = (playerId === this.playerActive) ? "Your turn" : "Opponent's turn";
    let winner = false;
    let looser = false;
    let tied = false
    if (this.gameOver) {
      status = 'Game over. ';
      if (this.winner === playerId) {
        winner = true;
        status += 'You win! Refresh the page to play again.';
      } else {
        looser = true
        status += 'You lose. Refresh the page to play again.';
      }
    } else if (this.gameTied) {
      winner = false;
      looser = false
      tied = true;
      status = 'Game over. You tied. Refresh the page to play again.';
    }
    return {
      winner: winner,
      playerName: playerName,
      looser: looser,
      tied: tied,
      status: status,
      board: this.board.getBoard(),
    }
  }

  destroy() {
    delete this.board;
  }
}

module.exports = Game;
