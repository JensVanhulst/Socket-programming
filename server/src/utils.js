/** @format */

const topics = require('./constants/topics');
const zmq = require('zeromq');
const filter = require('./filter/badWords');

const socket = new zmq.Subscriber();
const push = new zmq.Push();

const filterMessage = async (name, message) => {
  const originalMessage = message.toString().split(' ');
  const messageRAW = message
    .toString()
    .toLowerCase()
    .split(' ');

  let j = 0;
  let hasBadWord = false;
  
  const filtered = messageRAW.map((word) => {
    if (filter.includes(word)) {
      hasBadWord = true;
      j++
      return (word = '🤐🤐🤐🤐');
    } else {
      j++;
      return originalMessage[j-1];
    }
  });

  try {
    if(hasBadWord)
    {
      await push.send(topics.RASPBERRY + name + " wrote a bad word.");
      await push.send(topics.FILTERED_MESSAGES + '👮‍♀️🚨- SYSTEM - 🚨👮‍♀️' + '&' + "PLEASE NO BAD WORDS IN MY CHAT");
    }
    await push.send(topics.FILTERED_MESSAGES + name + '&' + filtered.toString().replace(/,/g, " "));
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  topics,
  socket,
  push,
  filterMessage,
};
