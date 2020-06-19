 /** @format */
require('dotenv').config();
const { socket, push } = require('./utils');
const constants = require('./constants/index.js');
const handlers = require('./handlers');

const run = async () => {
  try {
    await socket.subscribe(constants.topics.BASE_TOPIC);
    await push.connect(constants.broker.SERVER_PULL);
    await socket.connect(constants.broker.SERVER_PUB);

    console.log('[INFO] - Connected and subscibed to all topics !');
    console.log('[INFO] - Publisher connected !');
  } catch (e) {
    console.log(e);
  }

  //NP_KT_JV>lobby>connectfour>join
  for await (const messages of socket) {
    if (messages.toString().includes(constants.topics.BASE_TOPIC + constants.topics.chat.RAW_MESSAGES)) {
      handlers.handleChatMessage(messages);

    } else if (messages.toString().includes(constants.topics.BASE_TOPIC + constants.topics.games.CF.BASE)) {
      handlers.handleConnectFour(messages);

    } else if (messages.toString().includes(constants.topics.BASE_TOPIC + constants.topics.games.TTT.BASE)) {
      handlers.handleTicTacToe(messages);

    } else if (messages.toString().includes(constants.topics.TEST_TOPIC)) {
      handlers.handleTestMessages(messages);

    } else if (messages.toString().includes(constants.topics.TEST_SUB_TOPIC) || !messages.toString().includes(constants.topics.BASE_TOPIC)) {
      handlers.handleSubTopics(messages);

    } else if (messages.toString().includes(constants.topics.chat.JOIN.SESSION_TOPIC) || messages.toString().includes('EXJ>NP_KT_JV>lobby>channel>')) {
      handlers.handleSessions(messages);
    }
  }
};
 
run();
