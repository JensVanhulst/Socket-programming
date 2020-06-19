/** @format */
const BASE_TOPIC = 'EXK>NP_KT_JV>lobby>';

module.exports = {
  broker: {
    SERVER_PULL: 'tcp://193.190.154.184:24041',
    SERVER_PUB: 'tcp://193.190.154.184:24042',
  },

  topics: {
    BASE_TOPIC,

    raspberry: {
      // Base_RASP
      BASE_RASP: 'NP_KT_JV>',
      // Raspberry
      RASPBERRY : 'raspberry>alerts>',
      // EXTRA RASP
      RASPBERRY_PLAYERTURN : 'EXK>NP_KT_JV>raspberry>tic-tac-toe>playerturn>',
      RASPBERRY_PUSHBUTTON : 'EXK>NP_KT_JV>raspberry>tic-tac-toe>pushbtn>',
    },

    chat: {
      RAW_MESSAGES: 'raw_messages>',
      FILTERED_MESSAGES: 'filtered_messages>',
      MEME : 'message>meme>'
    },

    games: {
      CF: {
        // Connect FOUR
        BASE: 'connectfour>',
        JOIN: {
          BASE: 'join>player>',
          SUCCES : BASE_TOPIC + 'connectfour>info>join>succes&',
          FULL : BASE_TOPIC + 'connectfour>info>join>full'
        },
        MOVE: 'move>',
        GAME_UPDATE: BASE_TOPIC + 'connectfour>gameupdate>'
      },
      
      TTT: {
        // TicTacToe
        BASE : 'tic-tac-toe>',
        JOIN: {
          BASE: 'join>player>',
          BASE_AI: 'vsAI>player>',
          SUCCES : BASE_TOPIC + 'tic-tac-toe>info>join>succes&',
          FULL : BASE_TOPIC + 'tic-tac-toe>info>join>full'
        },
        PLACE: 'place>',
        GAME_UPDATE: BASE_TOPIC + 'tic-tac-toe>gameupdate>'
      }
    }
  }
};
