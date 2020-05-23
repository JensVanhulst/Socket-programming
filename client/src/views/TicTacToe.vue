<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="9">
        <v-row class="justify-center">
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-00"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-01"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-02"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-10"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-11"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-12"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-20"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-21"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
          <v-col cols="3">
            <v-hover v-slot:default="{ hover }">
              <v-card
                :elevation="hover ? 16 : 2"
                class="ttt-field"
                id="ttt-22"
                @click="place()"
              ></v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const zmq = require('zeromq');

export default {
  data() {
    return {
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
    };
  },
  async mounted() {
    try {
      await this.subscriber.connect('tcp://193.190.154.184:24042');
      await this.subscriber.subscribe('NP_KT_JV>lobby>tic-tac-toe>');
      await this.publisher.connect('tcp://193.190.154.184:24041');
      console.log('Connected and subbed from home');
    } catch (error) {
      console.log(error);
    }

    /* eslint-disable */
    for await (const messages of this.subscriber) {
      // TODO : MAKE TOPIC TO info>join>name
      if (messages.toString().includes('tic-tact-toe>info>join>')) {
        const [, status] = messages.toString().split('NP_KT_JV>lobby>tic-tact-toe>info>join>');
        if (status === 'full') {
          this.waiting = false;
        }
      } else if (messages.toString().includes('')) {
        // ;;;
      }
    }
  },

  methods: {
    async place() {
      await this.publisher.send('NP_KT_JV>lobby>tic-tac-toe>place');
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
