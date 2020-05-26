 /** @format */
require('dotenv').config();
const { socket, topics, push } = require('./utils');
const handlers = require('./handlers');

const run = async () => {
  try {
    await socket.connect('tcp://193.190.154.184:24042');
    await socket.subscribe(topics.RAW_MESSAGES);
    await socket.subscribe(topics.CONNECT_FOUR);
    await socket.subscribe(topics.TICTACTOE_JOIN);
    await push.connect('tcp://193.190.154.184:24041');

    console.log('[INFO] - Connected and subscibed to all topics !');
    console.log('[INFO] - Publisher connected !');
  } catch (e) {
    console.log(e);
  }

  //NP_KT_JV>lobby>connectfour>join
  for await (const messages of socket) {
    if (messages.toString().includes(topics.RAW_MESSAGES)) {
      handlers.handleChatMessage(messages);
    } else if (messages.toString().includes(topics.CONNECT_FOUR_JOIN)) {
      handlers.handleConnectFour(messages);
    } else if (messages.toString().includes(topics.TICTACTOE_JOIN)) {
      handlers.handleTicTacToe(messages);
    }
  }
};
 
run();
