import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    apiBase: "http://api.bunnyxt.com/tdd/",
    //apiBase: "http://localhost/tdd/", // debug
  }
})

export default store