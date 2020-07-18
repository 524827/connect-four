const Game = require('./Game');
const { UPDATE_EVENT } = require('../constants');

class NetworkGame extends Game {


  /**
   * Create a game with player sockets
   * @param {socket.io socket} player1Socket
   * @param {socket.io socket} player2Socket
   * @param {object} board - the game board
   */
  constructor(player1Socket, player2Socket, board) {
    // because socket id's are always unique, we can use them as player identifiers
    super(player1Socket.id, player2Socket.id, board);
    this.player1Socket = player1Socket;
    this.player2Socket = player2Socket;
    this.opponentDisconnected = false;
  }



  /**
   * Indicate the opponent has disconnected from the game server
   */
  setOpponentDisconnected() {
   // this.destroy();
    this.opponentDisconnected = true;
    this.gameOver = true;
  }


  /**
   * Broadcast the game state to each player socket
   */
  async broadcast() {

    let data = await this.getGameStateForPlayer(this.player1Socket.id, this.player1Socket.playername);
    if (this.opponentDisconnected) {
      data.status = this.player2Socket.playername + ' is offline. Refresh the page to start a new game.';
      this.player1Socket.emit(UPDATE_EVENT, { status: data.status, board:[]  });
    } else {
      this.player1Socket.emit(UPDATE_EVENT, data);
    }


    data = await this.getGameStateForPlayer(this.player2Socket.id, this.player2Socket.playername);
    if (this.opponentDisconnected) {
      data.status = this.player1Socket.playername + ' is offline. Refresh the page to start a new game.';
      this.player2Socket.emit(UPDATE_EVENT, { status: data.status, board:[] });
    } else {
      this.player2Socket.emit(UPDATE_EVENT, data);
    }
  }

}

module.exports = NetworkGame;