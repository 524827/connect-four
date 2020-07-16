const NetworkGame = require('./models/NetworkGame');
const Board = require('./models/Board');

const { MOVE_EVENT, WAITING_EVENT } = require('./constants');

module.exports = {

  initSocket: () => {


  let games = {};
  let waitingPlayerSocket = null;
  let previousLength = null;
  io.on('connection', function (socket) {
    console.log('new player connected', socket.id);

    socket.on('join', (data) => {
      socket.join(socket.id);
      socket.playername = data.playername

      const currentLength = data.matrix;
    /***** start game *****/
      if (waitingPlayerSocket !== null && currentLength === previousLength) {
      console.log('game started', waitingPlayerSocket.id, socket.id);
      let newGame = new NetworkGame(waitingPlayerSocket, socket, new Board(data.matrix));
      // store in hashmap indexed by player connection for future lookup
      games[socket.id] = newGame;
      games[waitingPlayerSocket.id] = newGame;
      waitingPlayerSocket = null;
      newGame.broadcast();
      } else {
      previousLength = currentLength;
      waitingPlayerSocket = socket;
      socket.emit(WAITING_EVENT, 'Waiting for opponent to connect to server.')
      console.log('player waiting');
    }
    });


    /***** end game *****/
    socket.on('disconnect', function () {
      console.log('player left')
      socket.leave(socket.id);
      // waiting player left. free up waiting space
      if (waitingPlayerSocket !== null && socket.id === waitingPlayerSocket.id) {
        waitingPlayerSocket = null;
      } else if (games[socket.id]) {
        // game participant left. inform their opponent and clean up the game
        // if the game was finished, persist it to disk
        let currentGame = games[socket.id];
        if (currentGame) {
          let opponentSocket = currentGame.getOpponent(socket.id);

          currentGame.setOpponentDisconnected();
          currentGame.broadcast();

          currentGame.destroy();
          delete games[socket.id];
          delete games[opponentSocket];
          delete currentGame;
        }
      }
    });

    /***** incoming move *****/
    socket.on(MOVE_EVENT, function (column) {
      console.log('player moved', column, socket.id);
      let currentGame = games[socket.id];
      console.log(currentGame);
      if (currentGame) {
        currentGame.move(socket.id, parseInt(column));
        currentGame.broadcast();
      }
    });
  });
  }
}