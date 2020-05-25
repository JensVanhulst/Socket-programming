<template>
  <div>
    <v-container>
      <v-row class="justify-center">
        <v-col cols="4">
          <v-hover v-slot:default="{ hover }">
            <v-card @click="join" :elevation="hover ? 16 : 2" class="game-card" height="300px">
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-hover v-slot:default="{ hover }">
            <v-card
              @click="joinTicTacToe"
              :elevation="hover ? 16 : 2"
              class="game-card-2"
              height="300px"
            >
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="modal" max-width="290">
      <v-card>
        <v-card-title class="headline">JOIN FAILED</v-card-title>
        <v-card-text>
          The limit of the amount of players has been reached. Please try again later.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="modal = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const zmq = require('zeromq');

export default {
  props: ['username'],
  data() {
    return {
      modal: false,
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
      chatMessage: '',
      items: [
        // { divider: true, inset: true },
      ],
    };
  },
  async mounted() {
    try {
      await this.subscriber.connect('tcp://193.190.154.184:24042');
      await this.subscriber.subscribe('NP_KT_JV>lobby>');
      await this.publisher.connect('tcp://193.190.154.184:24041');
    } catch (error) {
      console.log(error);
    }
    /* eslint-disable */
    for await (const messages of this.subscriber) {
      if (messages.toString().includes('connectfour>info>join>')) {
        const [, status] = messages.toString().split('NP_KT_JV>lobby>connectfour>info>join>');

        if (status === `succes&${this.username}`) {
          this.$router.push({ name: 'ConnectFour' });
        } else if (status === 'full') {
          this.modal = true;
        }
      } else if (messages.toString().includes('tic-tac-toe>info>join>')) {
        const [, status] = messages.toString().split('NP_KT_JV>lobby>tic-tac-toe>info>join>');

        if (status === `succes&${this.username}`) {
          this.$router.push({ name: 'TicTacToe' });
        } else if (status === 'full') {
          this.modal = true;
        }
      }
    }
  },
  methods: {
    async join() {
      try {
        await this.publisher.send(`NP_KT_JV>lobby>connectfour>join>player>${this.username}`);
      } catch (error) {
        console.log(error);
      }
    },
    async joinTicTacToe() {
      try {
        await this.publisher.send(`NP_KT_JV>lobby>tic-tac-toe>join>player>${this.username}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
.game-card {
  &:hover {
    cursor: pointer;
  }
  background-position: center;
  background-size: cover;
  background-image: url('https://store-images.s-microsoft.com/image/apps.41929.13682804428841430.68f0af32-8ea6-49bc-b838-d812036d39e9.80b85532-1417-4579-9726-abd1699a6297?mode=scale&q=90&h=1080&w=1920');
}

.game-card-2 {
  &:hover {
    cursor: pointer;
  }
  background-position: center;
  background-size: contain;
  background-image: url('https://i.ytimg.com/vi/kp-ASZIsqrI/maxresdefault.jpg');
}
</style>
