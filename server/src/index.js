/** @format */
require('dotenv').config();
const zmq = require('zeromq');
const Tournament = require('./classes/Tournament');
const topics = require('./constants/topics');

const socket = new zmq.Subscriber();
const tournament = new Tournament(4);

const run = async () => {
  try {
    await socket.connect('tcp://193.190.154.184:24042');
    await socket.subscribe('');
    console.log('[INFO] - Connected and subscibed to all topics !');
    console.log(`Created a new tournament with id ${tournament.id}`);
  } catch (e) {
    console.log(e);
  }

  console.log(tournament.gPlayerAmount);

  for await (const [topic, msg] of socket) {
    tournament.addPlayer(String(msg));
    console.log(tournament.gPlayerAmount);
  }
};

run();
