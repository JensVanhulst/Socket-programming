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
              <h1>{{ board[0][0] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-01')">
              <h1>{{ board[0][1] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-02')">
              <h1>{{ board[0][2] }}</h1>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-10')">
              <h1>{{ board[1][0] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-11')">
              <h1>{{ board[1][1] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-12')">
              <h1>{{ board[1][2] }}</h1>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-20')">
              <h1>{{ board[2][0] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-21')">
              <h1>{{ board[2][1] }}</h1>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="ttt-field" @click="place('ttt-22')">
              <h1>{{ board[2][2] }}</h1>
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
  </v-container>
</template>

<script>
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
      waiting: true,
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
      playerturn: '',
    };
  },
  async mounted() {
    try {
      await this.subscriber.connect('tcp://193.190.154.184:24042');
      await this.subscriber.subscribe('NP_KT_JV>lobby>tic-tac-toe>');
      await this.publisher.connect('tcp://193.190.154.184:24041');
      console.log('Connected and subbed from home.');
    } catch (error) {
      console.log(error);
    }

    /* eslint-disable */
    for await (const messages of this.subscriber) {
      // TODO : MAKE TOPIC TO info>join>name
      if (messages.toString().includes('tic-tac-toe>info>join>')) {
        const [, status] = messages.toString().split('NP_KT_JV>lobby>tic-tac-toe>info>join>');
        if (status === 'full') {
          this.waiting = false;
        }
      } else if (messages.toString().includes('NP_KT_JV>lobby>tic-tac-toe>gameupdate>')) {
        // We Get this: NP_KT_JV>lobby>tic-tac-toe>gameupdate>Kasper&0&0&X
        let gameUpdate = messages.toString().replace('NP_KT_JV>lobby>tic-tac-toe>gameupdate>', '');
        let [playerTurn, x, y, X_O_Move] = gameUpdate.toString().split('&');
        //this.board[x][y] = X_O_Move.toString();
        this.playerturn = playerTurn; 
        console.log(this.board[parseInt(x)][parseInt(y)]);
        this.board[parseInt(x)][parseInt(y)] = X_O_Move.toString();
      }
    }
  },

  methods: {
    async place(id) {
      // SEND: NP_KT_JV>lobby>tic-tac-toe>place>Jens&ttt-11>
      await this.publisher.send(`NP_KT_JV>lobby>tic-tac-toe>place>${this.username}&${id}`);
    },
  },
};
</script>

<style lang="scss">
.ttt-field {
  height: 200px;
  width: 200px;
}
</style>
