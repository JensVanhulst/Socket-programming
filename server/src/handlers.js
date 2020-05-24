/** @format */

const ConnectFour = require('./classes/ConnectFour');
const TicTacToe = require('./classes/TicTacToe');
const { filterMessage, topics, push } = require('./utils');
const connectFour = new ConnectFour(2);
const ticTacToe = new TicTacToe(2);

const handleTicTacToe = async (messages) => {
  //NP_KT_JV>lobby>tic-tac-toe>join>player>Jens
  const [, command] = messages.toString().split(topics.TICTACTOE_JOIN);
  if (command.includes('player>')) {
    const [, name] = command.split('player>');

    if (ticTacToe.gPlayerAmount < 2) {
      ticTacToe.addPlayer(name);
      await push.send(`NP_KT_JV>lobby>tic-tac-toe>info>join>succes&${name}`);
    }
    if (ticTacToe.gPlayerAmount == 2) {
      setTimeout(async () => {
        await push.send('NP_KT_JV>lobby>tic-tac-toe>info>join>full');
      }, 2000);
      console.log('full');
    }
  }
  // INCOMING: NP_KT_JV>lobby>tic-tac-toe>place>Jens&ttt-11>
  else if(command.includes('place>')) {
    const arguments = messages.toString().replace('NP_KT_JV>lobby>tic-tac-toe>place>', '');
    const [name, move] = arguments.split('&');
    const [x,y] =  move.toString().replace('ttt-', '');

    const serverResponse = ticTacToe.place(name, x, y);;
    console.log('SERVER RESPONSE', serverResponse);
    try {
      await push.send(
        `NP_KT_JV>lobby>tic-tac-toe>gameupdate>${serverResponse.playerTurn}&${serverResponse.x}&${serverResponse.y}&${serverResponse.X_O_Move}`,
      );
    } catch (error) {
      console.log(error);
    }
  }
};

const handleConnectFour = async (messages) => {
  // >connect4>join>player>jens
  const [, command] = messages.toString().split(topics.CONNECT_FOUR);

  // TODO: Remove players when done or the leave, '
  // >join>player>jens
  if (command.includes('join>player>')) {
    const [, name] = command.split('join>player>');
    if (connectFour.gPlayerAmount < 2) {
      connectFour.addPlayer(name);
      await push.send(`NP_KT_JV>lobby>connectfour>info>join>succes&${name}`);
    }
    if (connectFour.gPlayerAmount == 2) {
      setTimeout(async () => {
        await push.send('NP_KT_JV>lobby>connectfour>info>join>full');
      }, 2000);
      console.log('full');
    }
  } else if (command.includes('move>')) {
    // INPUT : move>Jens&6
    let data = command.replace('move>', '');
    //INPUT : Jens&6
    const [name, column] = data.split('&');
    const serverResponse = connectFour.move(name, column);
    console.log('SERVER RESPONSE', serverResponse);

    //color&x&y&turn
    try {
      await push.send(
        `NP_KT_JV>lobby>connectfour>gameupdate>${serverResponse.color}&${serverResponse.column}&${serverResponse.row}&${serverResponse.playerturn}`,
      );
    } catch (error) {
      console.log(error);
    }
  } else if (command.includes('finish')) {
    connectFour.reset();
  }
};

const handleChatMessage = (messages) => {
  const [, msg] = messages.toString().split(topics.RAW_MESSAGES);
  const [name, message] = msg.split('&');
  filterMessage(name, message);
};

module.exports = {
  handleChatMessage,
  handleConnectFour,
  handleTicTacToe,
};
