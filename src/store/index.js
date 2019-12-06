import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiBase: "https://api.bunnyxt.com/tdd/",
    //apiBase: "http://localhost/tdd/", // debug
    isSliderVisible: false
  },
  mutations: {
    changeSliderVisibility(state) {
      state.isSliderVisible = !state.isSliderVisible;
    }
  }
});

export default store