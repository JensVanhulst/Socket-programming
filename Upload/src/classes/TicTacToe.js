/** @format */

class TicTacToe {
  constructor(maxPlayerAmount) {
    this.players = [];
    this.winner = 'no-winner';
    this.winType = '';
    this.MAX_PLAYER_AMOUNT = maxPlayerAmount;
    this.emptyBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
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

  reset() {
    this.board = this.emptyBoard;
    this.players = [];
    this.winner = 'no-winner';
    this.winType = '';
  }

  checkHorizontalWin() {
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] == this.board[i][1] &&
        this.board[i][1] == this.board[i][2] &&
        this.board[i][2] != 0
      ) {
        this.winType = 'Horizontal Win';
        if (this.board[i][1] == 'X') {
          this.winner = this.players[0];
          return 1;
        } else {
          this.winner = this.players[1];
          return 1;
        }
      }
    }
  }

  checkVerticalWin() {
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] == this.board[1][i] &&
        this.board[1][i] == this.board[2][i] &&
        this.board[2][i] != 0
      ) {
        this.winType = 'Vertical Win';
        if (this.board[1][i] == 'X') {
          this.winner = this.players[0];
          return 1;
        } else {
          this.winner = this.players[1];
          return 1;
        }
      }
    }
  }

  checkDiagonalWin() {
    for (let i = 0; i < 2; i++) {
      if (
        (this.board[0][0] == this.board[1][1] &&
          this.board[1][1] == this.board[2][2] &&
          this.board[2][2] != 0) ||
        (this.board[2][0] == this.board[1][1] &&
          this.board[1][1] == this.board[0][2] &&
          this.board[0][2] != 0)
      ) {
        this.winType = 'Diagonal Win';
        if (this.board[1][1] == 'X') {
          this.winner = this.players[0];
          return 1;
        } else {
          this.winner = this.players[1];
          return 1;
        }
      }
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

    this.checkHorizontalWin();
    this.checkVerticalWin();
    this.checkDiagonalWin();

    return {
      playerTurn,
      x,
      y,
      X_O_Move,
      winner: this.winner,
      type: this.winType,
    };
  }
}

module.exports = TicTacToe;
