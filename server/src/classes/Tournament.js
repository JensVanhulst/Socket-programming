/** @format */

class Tournament {
  constructor(maxPlayerAmount) {
    this.id = Math.random()
      .toString(36)
      .substring(7);

    this.players = [];
    this.MAX_PLAYER_AMOUNT = maxPlayerAmount;
  }

  get gPlayerAmount() {
    return this.players.length;
  }

  addPlayer(playerName) {
    if (this.players.length < this.MAX_PLAYER_AMOUNT) {
      this.players.push(playerName);
    }
  }
}

module.exports = Tournament;
