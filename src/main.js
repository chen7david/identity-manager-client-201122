import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import url from 'url'
import config from './../config/default'
const socket = io(url.format(config.server))

console.log(url.format(config.server))
Vue.use(VueSocketIOExt, socket)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
