/** @format */

class Channels {
  constructor(id) {
    this.channelID = id;
    this.users = [];
    this.messages = [];
  }

  joinChannel(user) {
    this.users.push(user);
  }

  leaveChannel(user) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }

  get usersInChannel() {
    return this.users;
  }
}
module.exports = Channels;
