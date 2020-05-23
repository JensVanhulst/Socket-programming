<template>
  <v-container>
    <v-row class="justify-center" v-if="!waiting">
      <v-col cols="12">
        <!-- TODO : Kleur van de speler maken -->
        <h2 v-if="playerTurn !== username" class="text-center">{{ `It's ${playerTurn} turn` }}</h2>
        <h2 v-else class="text-center">It's your turn !</h2>
      </v-col>
    </v-row>
    <v-row v-if="!waiting">
      <!-- TODO : Refactor -->
      <v-col v-if="playerColor === 'yellow'" cols="12" class="text-center">
        <span @click="drop(0)" class="dot-red"></span>
        <span @click="drop(1)" class="dot-red"></span>
        <span @click="drop(2)" class="dot-red"></span>
        <span @click="drop(3)" class="dot-red"></span>
        <span @click="drop(4)" class="dot-red"></span>
        <span @click="drop(5)" class="dot-red"></span>
        <span @click="drop(6)" class="dot-red"></span>
      </v-col>
      <v-col v-else-if="playerColor === 'red'" cols="12" class="text-center">
        <span @click="drop(0)" class="dot-yellow"></span>
        <span @click="drop(1)" class="dot-yellow"></span>
        <span @click="drop(2)" class="dot-yellow"></span>
        <span @click="drop(3)" class="dot-yellow"></span>
        <span @click="drop(4)" class="dot-yellow"></span>
        <span @click="drop(5)" class="dot-yellow"></span>
        <span @click="drop(6)" class="dot-yellow"></span>
      </v-col>
      <v-col v-else cols="12" class="text-center">
        <span @click="drop(0)" class="dot-red"></span>
        <span @click="drop(1)" class="dot-red"></span>
        <span @click="drop(2)" class="dot-red"></span>
        <span @click="drop(3)" class="dot-red"></span>
        <span @click="drop(4)" class="dot-red"></span>
        <span @click="drop(5)" class="dot-red"></span>
        <span @click="drop(6)" class="dot-red"></span>
      </v-col>
    </v-row>
    <v-row class="justify-center" v-if="!waiting">
      <div class="board">
        <v-row class="h-55">
          <v-col class="b-55" :class="board[0][0]"></v-col>
          <v-col class="b-55" :class="board[0][1]"></v-col>
          <v-col class="b-55" :class="board[0][2]"></v-col>
          <v-col class="b-55" :class="board[0][3]"></v-col>
          <v-col class="b-55" :class="board[0][4]"></v-col>
          <v-col class="b-55" :class="board[0][5]"></v-col>
          <v-col class="b-55" :class="board[0][6]"></v-col>
        </v-row>
        <v-row class="h-55">
          <v-col class="b-55" :class="board[1][0]"></v-col>
          <v-col class="b-55" :class="board[1][1]"></v-col>
          <v-col class="b-55" :class="board[1][2]"></v-col>
          <v-col class="b-55" :class="board[1][3]"></v-col>
          <v-col class="b-55" :class="board[1][4]"></v-col>
          <v-col class="b-55" :class="board[1][5]"></v-col>
          <v-col class="b-55" :class="board[1][6]"></v-col>
        </v-row>
        <v-row class="h-55">
          <v-col class="b-55" :class="board[2][0]"></v-col>
          <v-col class="b-55" :class="board[2][1]"></v-col>
          <v-col class="b-55" :class="board[2][2]"></v-col>
          <v-col class="b-55" :class="board[2][3]"></v-col>
          <v-col class="b-55" :class="board[2][4]"></v-col>
          <v-col class="b-55" :class="board[2][5]"></v-col>
          <v-col class="b-55" :class="board[2][6]"></v-col>
        </v-row>
        <v-row class="h-55">
          <v-col class="b-55" :class="board[3][0]"></v-col>
          <v-col class="b-55" :class="board[3][1]"></v-col>
          <v-col class="b-55" :class="board[3][2]"></v-col>
          <v-col class="b-55" :class="board[3][3]"></v-col>
          <v-col class="b-55" :class="board[3][4]"></v-col>
          <v-col class="b-55" :class="board[3][5]"></v-col>
          <v-col class="b-55" :class="board[3][6]"></v-col>
        </v-row>
        <v-row class="h-55">
          <v-col class="b-55" :class="board[4][0]"></v-col>
          <v-col class="b-55" :class="board[4][1]"></v-col>
          <v-col class="b-55" :class="board[4][2]"></v-col>
          <v-col class="b-55" :class="board[4][3]"></v-col>
          <v-col class="b-55" :class="board[4][4]"></v-col>
          <v-col class="b-55" :class="board[4][5]"></v-col>
          <v-col class="b-55" :class="board[4][6]"></v-col>
        </v-row>
        <v-row class="h-55">
          <v-col class="b-55" :class="board[5][0]"></v-col>
          <v-col class="b-55" :class="board[5][1]"></v-col>
          <v-col class="b-55" :class="board[5][2]"></v-col>
          <v-col class="b-55" :class="board[5][3]"></v-col>
          <v-col class="b-55" :class="board[5][4]"></v-col>
          <v-col class="b-55" :class="board[5][5]"></v-col>
          <v-col class="b-55" :class="board[5][6]"></v-col>
        </v-row>
      </div>
    </v-row>

    <v-overlay absolute opacity="0.8" :value="waiting" class="text-center">
      <h1>Waiting for other players to join !</h1>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>

      <!-- TODO : Kleur van de speler maken
        <v-btn color="orange lighten-2" @click="overlay = false">
            Back to lobby
        </v-btn> -->
    </v-overlay>

    <v-dialog v-model="modal" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ playerTurn }} has lost the Game.</v-card-title>
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
const zmq = require('zeromq');

export default {
  props: ['username'],
  data() {
    return {
      modal: false,
      waiting: true,
      typeOfWin: '',
      playerColor: '',
      playerTurn: null,
      yellow: 'bg-yellow',
      red: 'red',
      board: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      subscriber: new zmq.Subscriber(),
      publisher: new zmq.Push(),
    };
  },
  async mounted() {
    try {
      await this.subscriber.connect('tcp://193.190.154.184:24042');
      await this.subscriber.subscribe('NP_KT_JV>lobby>connectfour>');
      await this.publisher.connect('tcp://193.190.154.184:24041');
      console.log('Connected and subbed from home');
    } catch (error) {
      console.log(error);
    }
    /* eslint-disable */
    for await (const messages of this.subscriber) {
      // TODO : MAKE TOPIC TO info>join>name
      console.log('KASPRTESTJE', messages.toString())
      if (messages.toString().includes('connectfour>info>join>')) {
        const [, status] = messages.toString().split('NP_KT_JV>lobby>connectfour>info>join>');
        if (status === 'full') {
          this.waiting = false;
        }
      } else if (messages.toString().includes('>connectfour>gameupdate>')) {
        //${serverResponse.color}&${serverResponse.column}&${serverResponse.row}&${serverResponse.playerturn}`);
        let gameUpdate = messages.toString().replace('NP_KT_JV>lobby>connectfour>gameupdate>', '');
        let [color, col, row, playerturn] = gameUpdate.toString().split('&');
        this.board[row][col] = color;
        this.playerTurn = playerturn;
        this.playerColor = color;
        this.checkHorizontalWin();
        this.checkVerticalWin();
        //this.checkDiagonalWin();
      }
    }
  },
  methods: {
    returnToLobby() {
      this.modal = false;
      // TODO : SEND MESSAGE TO CLEAR ON SERVER
      this.$router.push({ path: '/' });
    },
    async checkHorizontalWin() {
      console.log(this.board);
      for (let r = 0; r <= 5; r++) {
        for (let c = 0; c <= 3; c++) {
          if (
            this.board[r][c] == this.board[r][c + 1] &&
            this.board[r][c + 1] == this.board[r][c + 2] &&
            this.board[r][c + 2] == this.board[r][c + 3] &&
            (this.board[r][c + 3] == 'yellow' || this.board[r][c + 3] == 'red')
          ) {
            this.modal = true;
            this.typeOfWin = 'Horizontal row';
            await this.publisher.send('NP_KT_JV>lobby>connectfour>finish');
          }
        }
      }
    },
    async checkVerticalWin() {
      for (let c = 0; c < 6; c++) {
        for (let r = 0; r < 3; r++) {
          if (
            this.board[r][c] == this.board[r + 1][c] &&
            this.board[r + 1][c] == this.board[r + 2][c] &&
            this.board[r + 2][c] == this.board[r + 3][c] &&
            (this.board[r + 3][c] == 'yellow' || this.board[r + 3][c] == 'red')
          ) {
            this.modal = true;
            this.typeOfWin = 'Vertical row';
            await this.publisher.send('NP_KT_JV>lobby>connectfour>finish');
          }
        }
      }
    },

    // TODO : to be fixed
    async checkDiagonalWin() {
      for (let r = 0; r <= 5; r++) 
      {
        for (let c = 0; c <= 3; c++) 
        {
          if(
              (c < 3 && 
                (this.board[r][c] == this.board[r + 1][c + 1] && this.board[r + 1][r + 1] == this.board[r + 2][c + 2] && this.board[r + 2][r + 2] == this.board[r + 3][r + 3] && (this.board[r + 3][c + 3] == 'yellow' || this.board[r + 3][c + 3] == 'red'))
              )

               ||
              (c >= 3 && 
               (this.board[r][c] == this.board[r - 1][c - 1] && this.board[r - 1][r - 1] == this.board[r - 2][c - 2] && this.board[r - 2][r - 2] == this.board[r - 3][r - 3] && (this.board[r - 3][c - 3] == 'yellow' || this.board[r - 3][c - 3] == 'red'))
              )
            )
          {
            this.modal = true;
            this.typeOfWin = 'Diagonal row';
            await this.publisher.send('NP_KT_JV>lobby>connectfour>finish');
          }
        }
      }
  },
    // SEND
    // NP_KT_JV>lobby>connectfour>move>name&index

    //receiver
    //NP_KT_JV>lobby>connectfour>aftermove>color&x&y&turn
    async drop(index) {
      try {
        await this.publisher.send(`NP_KT_JV>lobby>connectfour>move>${this.username}&${index}`);
        console.log('SEND MESSAGE');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
.bg-red {
  background-color: red;
}

.h-55 {
  margin-top: 9px;
  height: 50px;
  margin-bottom: 5px;
}

.h-55 .b-55:nth-child(1) {
  margin-left: 13px !important;
}

.h-55 .b-55:nth-child(7) {
  margin-right: 13px !important;
}

.b-55 {
  width: 30px !important;
}

.dot-red {
  height: 40px;
  width: 40px;
  margin: 0 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}
.dot-red:hover {
  background-color: red;
}

.dot-yellow {
  height: 40px;
  width: 40px;
  margin: 0 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}
.dot-yellow:hover {
  background-color: yellow;
}

.red {
  background-color: red;
}
.yellow {
  background-color: yellow;
}

.board {
  background-color: transparent;
  width: 450px;
  border: 15px solid #007fff;
  border-radius: 4px;
  box-sizing: border-box;
  width: 450px;
  height: 390px;
  pointer-events: none;
  background: radial-gradient(
      circle,
      transparent,
      transparent 18px,
      #007fff 20px,
      #007fff 23px,
      #1f90ff 23px,
      #1f90ff 36px,
      #007fff
    )
    center top/60px 60px;
}
</style>
