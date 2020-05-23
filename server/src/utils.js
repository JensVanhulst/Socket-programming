const topics = require('./constants/topics');
const zmq = require('zeromq');

const socket = new zmq.Subscriber();
const push = new zmq.Push();

const filterMessage = async (name, message) => {
  try {
    await push.send(topics.FILTERED_MESSAGES + name + '&' + message);
    console.log("Filtered and send succesfully");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  topics,
  socket,
  push,
  filterMessage
}