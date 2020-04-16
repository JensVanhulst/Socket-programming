const zmq = require("zeromq");

const BROKER_URL = "tcp://193.190.154.184:24042"

const run = async () => {
    const sock = new zmq.Subscriber();

    try {
        await sock.connect(BROKER_URL);
        await sock.subscribe("example>task!>");
        await sock.subscribe("example>answer!>")
        console.log("Connected and subscribed");
    } catch (e) {
        console.log(e);
        process.exit(1);
    }

    for await (const [topic, msg] of sock) {
        if (String(topic).includes('Jens Vanhulst'))
            console.log("Received a message related to:", String(topic), "containing message:", String(msg) )
    }
}

run();