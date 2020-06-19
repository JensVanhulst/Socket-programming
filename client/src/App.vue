<template>
  <v-app>
    <!-- TODO: BACK BEFORE WIN -->
    <v-app-bar app clipped-right clipped-left color="primary" dark>
      <!-- <v-icon @click="$router.push({ path: '/' })" v-if="$route.name !== 'Home'">
        mdi-arrow-left-thick
      </v-icon> -->
      <h1 class="ml-3">PXL Network programming</h1>
    </v-app-bar>
    <v-navigation-drawer class="bg-lightgrey" app clipped absolute permanent right width="300px">
      <v-container>
        <v-list-item class="bg-grey">
          <v-list-item-content>
            <v-list-item-title class="title text-center">
              CHAT
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-container>
      <v-divider class="chat-divider"></v-divider>
      <v-container class="chat-window pt-0 mt-0">
        <v-row>
          <v-col cols="12">
            <v-list two-line>
              <template v-for="(item, index) in items">
                <v-divider v-if="item.divider" :key="index"></v-divider>
                <v-list-item v-else :key="index">
                  <v-list-item-content>
                    <v-list-item-title color="primary">{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle color="error">{{ item.subtitle }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <template v-slot:append>
        <v-divider></v-divider>
        <v-container class="bg-white">
          <v-row class="mt-5">
            <v-col cols="8">
              <v-text-field v-model="chatMessage" dense label="Message" outlined> </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn @click="sendMessage()" color="success">Send</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-navigation-drawer>

    <v-navigation-drawer class="bg-lightgrey" app overflow left clipped permanent width="300px">
      <v-container>
        <v-list-item class="bg-grey">
          <v-list-item-content>
            <v-list-item-title class="title text-center">
              CHANNELS
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-container>

      <v-list dense nav>
        <v-list-item >
          <v-list-item-icon link @click="joinSession('general-chat-#123')">
            <v-icon>mdi-chat</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>General chat</v-list-item-title>
          </v-list-item-content>
           <v-list-item-icon>
            <v-icon @click="leaveSession('general-chat-#123')">mdi-close</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item >
          <v-list-item-icon>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-icon>
          <v-list-item-content link @click="joinSession('Discussions-chat-#423')">
            <v-list-item-title>Discussions</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon @click="leaveSession('Discussions-chat-#423')">mdi-close</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <transition name="fade" mode="out-in">
        <router-view :username="user"></router-view>
      </transition>
    </v-content>
    <v-overlay absolute opacity="0.8" :value="overlay">
      <v-form>
        <v-text-field v-model="user" type="text" outlined></v-text-field>
      </v-form>
      <v-btn color="orange lighten-2" @click="overlay = false">
        Create username
      </v-btn>
    </v-overlay>

    <v-overlay absolute opacity="0.8" :value="overlayMeme">
      <v-container>
        <v-img class="meme pa-5 ma-5" :src="imageUrl"></v-img>
        <v-row>
          <v-col cols="12" align="center">
            <v-btn dense color="orange lighten-2" @click="overlayMeme = false">
              close
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>
  </v-app>
</template>

<script>
import constants from './constants';

const zmq = require('zeromq');

export default {
  data() {
    return {
      img: '',
      aspect_ratio: 0,
      user: '',
      overlay: true,
      overlayMeme: false,
      publisher: new zmq.Push(),
      chatMessage: '',
      imageUrl: '',
      items: [
        // { divider: true, inset: true },
      ],
    };
  },
  async mounted() {
    if (!this.user) {
      this.overlay = true;
      this.user = '';
    }
    const subsciber = new zmq.Subscriber();
    await subsciber.connect(constants.broker.SERVER_PUB);
    await subsciber.subscribe(constants.topics.chat.FILTERED_MESSAGES);
    await subsciber.subscribe(constants.topics.chat.MEME);
    await this.publisher.connect(constants.broker.SERVER_PULL);

    /* eslint-disable */
    for await (const messages of subsciber) {
      if (messages.toString().includes('>meme')) {
        const [, meme] = messages.toString().split(constants.topics.chat.MEME);
        const [name, url] = meme.split('&');

        if (name === this.user) {
          this.imageUrl = url;
          this.overlayMeme = true;
        }
      } else if (messages.toString().includes('filtered_messages')) {
        const [, msg] = messages.toString().split(constants.topics.chat.FILTERED_MESSAGES);
        const [name, message] = msg.split('&');
        this.items.push({ title: name, subtitle: message });
        this.items.push({ divider: true, inset: true });
      }
    }
  },
  methods: {
    async sendMessage() {
      await this.publisher.send(
        `${constants.topics.chat.RAW_MESSAGES}${this.user}&${this.chatMessage}`,
      );
      this.chatMessage = '';
    },
    async joinSession(id) {
      try {
        await this.publisher.send(`${constants.topics.chat.JOIN.SESSION_TOPIC}${id}&${this.user}`);
      } catch (error) {
        console.log(error);
      }
    },
    async leaveSession(id) {
      try {
         await this.publisher.send(`EXJ>NP_KT_JV>lobby>channel>leave>${id}&${this.user}`);
         console.log("send");
         
      } catch (error) {
        console.log(error);
        
      }
     
    } 
  },
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bg-grey {
  background-color: rgb(240, 240, 240);
}

.bg-lightgrey {
  background-color: rgb(252, 252, 252) !important;
}

.bg-white {
  background-color: rgb(255, 255, 255) !important;
}

.chat-header {
  position: fixed;
  z-index: 5;
  width: 100%;
}
.chat-window {
  display: block;
}

.v-list-item__title {
  color: rgb(25, 116, 207);
}
.v-list-item__subtitle {
  color: rgb(0, 0, 0) !important;
}

.meme {
  width: 300px;
}
</style>
