/** @format */

const ConnectFour = require('./classes/ConnectFour');
const TicTacToe = require('./classes/TicTacToe');
const Channels = require('./classes/Channels');
const getMeme = require('./api');

const { filterMessage, push, socket } = require('./utils');
const constants = require('./constants/index');
const connectFour = new ConnectFour(2);
const ticTacToe = new TicTacToe(2);
const generalChannel = new Channels('general-chat-#123');
const discussionChannel = new Channels('Discussions-chat-#423');

const handleTicTacToe = async (messages) => {
  const [, command] = messages
    .toString()
    .split(constants.topics.games.TTT.BASE);

  if (command.includes(constants.topics.games.TTT.JOIN.BASE)) {
    const [, name] = command.split(constants.topics.games.TTT.JOIN.BASE);

    if (ticTacToe.gPlayerAmount < 2) {
      ticTacToe.addPlayer(name);
      await push.send(`${constants.topics.games.TTT.JOIN.SUCCES}${name}`);
    }
    if (ticTacToe.gPlayerAmount == 2) {
      setTimeout(async () => {
        await push.send(constants.topics.games.TTT.JOIN.FULL);
      }, 2000);
    }
  } else if (command.includes(constants.topics.games.TTT.PLACE)) {
    console.log(ticTacToe.gPlayerAmount);
    const arguments = messages
      .toString()
      .replace(
        constants.topics.BASE_TOPIC +
          constants.topics.games.TTT.BASE +
          constants.topics.games.TTT.PLACE,
        '',
      );
    const [name, move] = arguments.split('&');
    const [x, y] = move.toString().replace('ttt-', '');

    console.log('Name :' + name);

    const serverResponse = ticTacToe.place(name, x, y);
    console.log('SRV :' + JSON.stringify(serverResponse));
    if (serverResponse.winner !== 'no-winner') {
      ticTacToe.reset();
    }
    try {
      await push.send(
        `${constants.topics.games.TTT.GAME_UPDATE}${serverResponse.playerTurn}&${serverResponse.x}&${serverResponse.y}&${serverResponse.X_O_Move}&${serverResponse.winner}&${serverResponse.type}`,

        //`${constants.topics.games.TTT.GAME_UPDATE}${serverResponse.playerTurn}&${serverResponse.x}&${serverResponse.y}&${serverResponse.X_O_Move}&${serverResponse.winner}&${serverResponse.type}`,
      );
    } catch (error) {
      console.log(error);
    }
  }
};

const handleConnectFour = async (messages) => {
  const [, command] = messages.toString().split(constants.topics.games.CF.BASE);
  // TODO: Remove players when done or the leave, '
  if (command.includes(constants.topics.games.CF.JOIN /*SON & FRED*/.BASE)) {
    const [, name] = command.split(constants.topics.games.CF.JOIN.BASE);
    if (connectFour.gPlayerAmount < 2) {
      connectFour.addPlayer(name);
      await push.send(`${constants.topics.games.CF.JOIN.SUCCES}${name}`);
    }

    if (connectFour.gPlayerAmount == 2) {
      setTimeout(async () => {
        await push.send(`${constants.topics.games.CF.JOIN.FULL}`);
      }, 2000);
    }
  } else if (command.includes(constants.topics.games.CF.MOVE)) {
    let data = command.replace(constants.topics.games.CF.MOVE, '');
    const [name, column] = data.split('&');
    const serverResponse = connectFour.move(name, column);

    try {
      await push.send(
        `${constants.topics.games.CF.GAME_UPDATE}${serverResponse.color}&${serverResponse.column}&${serverResponse.row}&${serverResponse.playerturn}`,
      );
    } catch (error) {
      console.log(error);
    }
  } else if (command.includes('finish')) {
    connectFour.reset();
  }
};

const handleChatMessage = async (messages) => {
  const [, msg] = messages.toString().split(constants.topics.chat.RAW_MESSAGES);
  const [name, message] = msg.split('&');
  console.log(msg);
  if (message === '!meme' || message === '!bart' || message === '!patel') {
    let url = await getMeme();
    try {
      console.log(url);
      await push.send(
        constants.topics.BASE_TOPIC +
          constants.topics.chat.MEME +
          name +
          '&' +
          url,
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    filterMessage(name, message);
  }
};

const handleTestMessages = async (messages) => {
  const [, data] = messages.toString().split(constants.topics.TEST_TOPIC);
  const [topic, message] = data.split('&');
  await push.send(`${topic}${message}`);
};

const handleSubTopics = async (messages) => {
  if (messages.toString().includes(constants.topics.TEST_SUB_TOPIC)) {
    const [topic, data] = messages
      .toString()
      .split(constants.topics.TEST_SUB_TOPIC);
    const [, cmd] = data.split('&');
    console.log(topic);
    if (cmd === 'stop') {
      try {
        socket.unsubscribe(topic === '' ? '' : topic);
        console.log('Successfully unsubscibed from :', topic);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await socket.subscribe(topic);
        console.log('Successfully subscibed to :', topic);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    console.log(messages.toString());
    try {
      await push.send(
        'EXJ>NP_KT_JV>lobby>benternet>test>' + messages.toString(),
      );
    } catch (error) {
      console.log(error);
    }
  }
};

const handleSessions = async (messages) => {
  console.log(messages.toString());
  if (messages.toString().includes('EXJ>NP_KT_JV>lobby>channel>leave>')) {
    const [, username] = messages
      .toString()
      .split('EXJ>NP_KT_JV>lobby>channel>leave>general-chat-#123&');
    generalChannel.leaveChannel(username);
    console.log(generalChannel.usersInChannel);
  }

  if (messages.toString().includes('general-chat-#123')) {
    const [, username] = messages
      .toString()
      .split('EXJ>NP_KT_JV>lobby>channel>join>general-chat-#123&');
    generalChannel.joinChannel(username);
    console.log(generalChannel.usersInChannel);
    
  } else if (messages.toString().includes('Discussions-chat-#423')) {
    const [, username] = messages
      .toString()
      .split('EXJ>NP_KT_JV>lobby>channel>join>general-chat-#123&');
    discussionChannel.joinChannel(username);
    console.log(discussionChannel.usersInChannel);
  }
  
};

module.exports = {
  handleSubTopics,
  handleTestMessages,
  handleChatMessage,
  handleConnectFour,
  handleTicTacToe,
  handleSessions,
};
