class ConnectFour {
 
  constructor (maxPlayerAmount) {
    this.MAX_PLAYER_AMOUNT = maxPlayerAmount;
    this.players = [];
    this.initialBoard = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
    this.board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }

  get gPlayerAmount() {
    return this.players.length;
  }

  get gPlayerNames() {
    return this.players;
  }

  reset() {
    this.players = [];
    this.board = this.initialBoard;
    console.log('GAME RESET');
  }

  addPlayer(name) {
    if (this.players.length <= this.MAX_PLAYER_AMOUNT) {
      this.players.push(name);
    }
  }

  move(name, column) {
    let i = 0;
    let j = 0;
    let row = 0;
    // TODO : REFACTOR THIS CRAP PLESE
    let col1 = ++column;
    let col = --column;

    let color = '';
    let playerturn = '';

    while (i < 5) 
    {
      j = i + 1;
      if (this.board[j][col] === 0) 
      {
        if (i == 4) 
        {
          this.board[j][col] = 1;
          row = 5;
          i++;
        } 
        else 
        {
          i++;
        }
      } 
      else 
      {
        this.board[i][col] = 1;
        row = i;
        i = 6;
      }
    }

    if(name === this.players[0]){ 
      color = 'red'; 
      playerturn = this.players[1]; 
    }

    else if(name === this.players[1]){ 

      color = 'yellow'; 
      playerturn = this.players[0]; 
    }

    return {
      row,
      column,
      color,
      playerturn,
    }
  }
}

module.exports = ConnectFour;