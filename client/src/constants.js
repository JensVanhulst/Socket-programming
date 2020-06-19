/** @format */
/* eslint-disable */
const BASE_TOPIC = 'EXJ>NP_KT_JV>lobby>';

export default {
  broker: {
    SERVER_PULL: 'tcp://193.190.154.184:24041',
    SERVER_PUB: 'tcp://193.190.154.184:24042',
  },

  topics: {
    BASE_TOPIC,
    TEST_TOPIC: BASE_TOPIC + 'benternet>push>message>',
    TEST_SUB_TOPIC: BASE_TOPIC + 'benternet>sub>topic>',

    chat: {
      RAW_MESSAGES: BASE_TOPIC + 'raw_messages>',
      FILTERED_MESSAGES: BASE_TOPIC + 'filtered_messages>',
      MEME: BASE_TOPIC + 'message>meme>',
      JOIN: {
        SESSION_TOPIC: BASE_TOPIC + 'channel>join>',
      }
    },

    games: {
      CF: {
        // Connect FOUR
        JOIN: {
          BASE: BASE_TOPIC + 'connectfour>info>join>',
          PLAYER: BASE_TOPIC + 'connectfour>join>player>'
        },
        MOVE: BASE_TOPIC + 'connectfour>move>',
        GAME_UPDATE: BASE_TOPIC + 'connectfour>gameupdate>',
        FINISH: BASE_TOPIC + 'connectfour>finish'
    },

      TTT: {
        // TicTacToe
        JOIN: {
          BASE: BASE_TOPIC + 'tic-tac-toe>info>join>',
          PLAYER: BASE_TOPIC + 'tic-tac-toe>join>player>',
        },
        PLACE: BASE_TOPIC + 'tic-tac-toe>place>',
        GAME_UPDATE: BASE_TOPIC + 'tic-tac-toe>gameupdate>',
      },
    },
  },
};
