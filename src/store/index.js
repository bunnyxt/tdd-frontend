import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    apiBase: "http://api.bunnyxt.com/tdd/",
    // apiBase: "localhost/tdd2/", // debug
  }
})

export default store