<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn @click="testBenternet = !testBenternet">Test Benternet</v-btn>
        </v-col>
      </v-row>
    </v-container>
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
    <v-dialog v-model="testBenternet" max-width="700">
      <v-btn @click="end()">
        QUIT
      </v-btn>
      <v-card>
        <v-card-title class="headline">Test benternet</v-card-title>
        <v-card-text>
          <v-tabs
            v-model="tab"
            background-color="deep-purple accent-4"
            centered
            dark
            icons-and-text
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1">
              SEND
              <v-icon>mdi-phone</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              RECEIVE
              <v-icon>mdi-heart</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-1">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <h2 class="mb-3">Enter your topic and message</h2>
                    <v-text-field
                      name="testTopic"
                      placeholder="testTopic"
                      v-model="testTopic"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      name="testMessage"
                      placeholder="testMessage"
                      v-model="testMessage"
                      outlined
                    ></v-text-field>
                    <v-btn color="success" @click="sendTestMessage()">Send test message</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-2">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      name="testTopicReveice"
                      placeholder="testTopicReveice"
                      v-model="testSubscibeTopic"
                      outlined
                    ></v-text-field>
                    <v-btn class="mx-3" color="success" @click="testSubscription()">Test Subscription</v-btn>
                    <v-btn @click="stopSubscription()" color="error">STOP</v-btn>
                  </v-col>
                </v-row>
              </v-container>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <p v-for="(item, i) in testMessages" :key="i">
                      {{ item }}
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import constants from '../constants';

const zmq = require('zeromq');

export default {
  props: ['username'],
  data() {
    return {
      modal: false,
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
      chatMessage: '',
      testBenternet: false,
      testTopic: '',
      testSubscibeTopic: '',
      testMessage: '',
      tab: '',
      items: [
        // { divider: true, inset: true },
      ],
      testMessages: [],
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
      if (messages.toString().includes(constants.topics.games.CF.JOIN.BASE)) {
        const [, status] = messages.toString().split(constants.topics.games.CF.JOIN.BASE);

        if (status === `succes&${this.username}`) {
          console.log(status);
          this.$router.push({ name: 'ConnectFour' });
        } else if (status === 'full') {
          this.modal = true;
        }
      } else if (messages.toString().includes(constants.topics.games.TTT.JOIN.BASE)) {
        const [, status] = messages.toString().split(constants.topics.games.TTT.JOIN.BASE);

        if (status === `succes&${this.username}`) {
          this.$router.push({ name: 'TicTacToe' });
        } else if (status === 'full') {
          this.modal = true;
        }
      } else if (messages.toString().includes('EXJ>NP_KT_JV>lobby>benternet>test>')) {
        const [, message] = messages.toString().split('EXJ>NP_KT_JV>lobby>benternet>test>');
        this.testMessages.push(message);
      }
    }
  },
  methods: {
    async join() {
      try {
        await this.publisher.send(`${constants.topics.games.CF.JOIN.PLAYER}${this.username}`);
      } catch (error) {
        console.log(error);
      }
    },
    async joinTicTacToe() {
      try {
        await this.publisher.send(`${constants.topics.games.TTT.JOIN.PLAYER}${this.username}`);
      } catch (error) {
        console.log(error);
      }
    },
    async sendTestMessage() {
      try {
        this.publisher.send(`${constants.topics.TEST_TOPIC}${this.testTopic}${this.testMessage}`);
      } catch (error) {
        console.log(error);
      }
    },
    async testSubscription() {
      try {
        this.publisher.send(`${constants.topics.TEST_SUB_TOPIC}${this.testSubscibeTopic}`);
      } catch (error) {
        console.log(error);
      }
    },
    async stopSubscription() {
       try {
        this.publisher.send(`${constants.topics.TEST_SUB_TOPIC}${this.testSubscibeTopic}&stop`);
      } catch (error) {
        console.log(error);
      }
    },
    end() {
      this.testBenternet = false;
      this.testMessages = [];
      this.testSubscibeTopic = '';
      this.testMessage = '';
      this.testTopic = '';
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
