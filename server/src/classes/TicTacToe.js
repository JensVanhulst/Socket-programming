/** @format */

class TicTacToe {
  constructor(maxPlayerAmount) {
    this.players = [];
    this.MAX_PLAYER_AMOUNT = maxPlayerAmount;
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  get gPlayerAmount() {
    return this.players.length;
  }

  get gPlayerNames() {
    return this.players;
  }

  addPlayer(name) {
    if (this.players.length <= this.MAX_PLAYER_AMOUNT) {
      this.players.push(name);
    }
  }

  place(name, x, y) {
    let playerTurn = '';
    let X_O_Move = '';
    if (name === this.players[0]) {
      this.board[x][y] = 'X';
      playerTurn = this.players[1];
    } else if (name === this.players[1]) {
      this.board[x][y] = 'O';
      playerTurn = this.players[0];
    }

    X_O_Move = this.board[x][y];

    return {
      playerTurn,
      x,
      y,
      X_O_Move,
    };
  }
}

module.exports = TicTacToe;
