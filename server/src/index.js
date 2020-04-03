/** @format */
require('dotenv').config();

const zmq = require('zeromq');
const responder = zmq.socket('rep');

const PORT = process.env.PORT || 9000;

responder.on('message', (request) => {
  console.log(`Received request: [ ${request.toString()}]`);

  setTimeout(() => {
    responder.send('Hi there');
  }, 1000);
});

responder.bind('tcp://*:' + PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on ${PORT}`);
  }
});

process.on('SIGINT', () => {
  responder.close();
});
