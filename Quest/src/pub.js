const zmq = require('zeromq');

const BROKER_URL = 'tcp://193.190.154.184:24041';

async function run() {
  const sock = new zmq.Push();

  try {
    await sock.connect(BROKER_URL);
    console.log('Publisher bound to port 3000');
  } catch (e) {
    console.log(e);
  }

  try {
    console.log('sending a message');
    // await sock.send(["example>task?>", "jens>"]);
    //await sock.send("example>task?>Jens Vanhulst>");
    await sock.send(
      'example>answer?>Jens Vanhulst>CORONA-FREE-CHANNEL>206aa41b473514e5a306e7d2d2ebd08d159e9bfe>*HATSJU*>',
    );
  } catch (e) {
    console.log(e);
  }
  sock.disconnect(BROKER_URL);
}

run();
