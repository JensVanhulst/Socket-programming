<template>
  <v-container>
    <v-row class="justify-center" v-if="!waiting">
      <v-col cols="12">
        <!-- TODO : Kleur van de speler maken -->
        <h2 v-if="playerturn !== username" class="text-center">{{ `It's ${playerturn} turn` }}</h2>
        <h2 v-else class="text-center">It's your turn !</h2>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="9">
        <v-row class="justify-center">
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-00')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[0][0] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-01')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[0][1] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-02')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[0][2] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-10')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[1][0] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-11')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[1][1] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-12')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[1][2] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-20')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[2][0] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-21')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[2][1] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-22')">
              <v-card-title primary-title class="justify-center">
                <h1 class="center">{{ board[2][2] }}</h1>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-overlay absolute opacity="1.0" :value="waiting" class="text-center">
      <h1>Waiting for other players to join !</h1>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>

      <!-- TODO : Kleur van de speler maken
        <v-btn color="orange lighten-2" @click="overlay = false">
            Back to lobby
        </v-btn> -->
    </v-overlay>

    <v-dialog v-model="modal" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ winner }} has won the Game.</v-card-title>
        <v-card-text>
          The player has won with {{ typeOfWin }} Please return to the lobby.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="returnToLobby">
            Return to lobby
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

import constants from '../constants';

const zmq = require('zeromq');

export default {
  props: ['username'],
  data() {
    return {
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      modal: false,
      waiting: true,
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
      playerturn: '',
      typeOfWin: '',
      winner: '',
    };
  },
  async mounted() {
    try {
      await this.subscriber.connect(constants.broker.SERVER_PUB);
      await this.subscriber.subscribe(constants.topics.BASE_TOPIC);
      await this.publisher.connect(constants.broker.SERVER_PULL);
    } catch (error) {
      console.log(error);
    }

    /* eslint-disable */
    for await (const messages of this.subscriber) {
      // TODO : MAKE TOPIC TO info>join>name
      if (messages.toString().includes(constants.topics.games.TTT.JOIN.BASE)) {
        const [, status] = messages.toString().split(constants.topics.games.TTT.JOIN.BASE);
        if (status === 'full') {
          this.waiting = false;
        }
      } else if (messages.toString().includes(constants.topics.games.TTT.GAME_UPDATE)) {
        // We Get this: NP_KT_JV>lobby>tic-tac-toe>gameupdate>Kasper&0&0&X
        let gameUpdate = messages.toString().replace(constants.topics.games.TTT.GAME_UPDATE, '');
        let [playerTurn, x, y, X_O_Move, winner, winType] = gameUpdate.toString().split('&');
        //this.board[x][y] = X_O_Move.toString();
        console.log(gameUpdate);
        
        this.playerturn = playerTurn;
        if (winner != 'no-winner') {
          this.typeOfWin = winType;
          this.winner = winner;
          this.modal = true;
        }
        this.board[parseInt(x)][parseInt(y)] = X_O_Move.toString();
      }
    }
  },

  methods: {
    returnToLobby() {
      this.modal = false;
      // TODO : SEND MESSAGE TO CLEAR ON SERVER
      this.$router.push({ path: '/' });
    },
    async place(id) {
      // SEND: NP_KT_JV>lobby>tic-tac-toe>place>Jens&ttt-11>
      await this.publisher.send(`${constants.topics.games.TTT.PLACE}${this.username}&${id}`);
    },
  },
};
</script>

<style lang="scss">
.ttt-field {
  height: 200px;
  width: 200px;
}
.center {
  font-size: 80px;
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
