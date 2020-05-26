import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
// Games
import ConnectFour from '../views/ConnectFour.vue';
import TicTacToe from '../views/TicTacToe.vue';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/connect-four',
    name: 'ConnectFour',
    component: ConnectFour,
  },
  {
    path: '/tic-tac-toe',
    name: 'TicTacToe',
    component: TicTacToe,
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
