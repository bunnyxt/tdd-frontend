import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiBase: "https://api.bunnyxt.com/tdd/",
    //apiBase: "http://localhost/tdd/", // debug
    isMenuSliderVisible: false,
    isLoginSliderVisible: false,
    isUserLoggedIn: false,
    clientWidth: 0,
    videoHomeData: null
  },
  mutations: {
    changeMenuSliderVisibility(state) {
      state.isMenuSliderVisible = !state.isMenuSliderVisible;
    },
    changeLoginSliderVisibility(state) {
      state.isLoginSliderVisible = !state.isLoginSliderVisible;
    },
    setClientWidth(state, clientWidth) {
      state.clientWidth = clientWidth;
    },
    storeVideoHomeData(state, data) {
      state.videoHomeData = data;
    }
  },
  getters: {
    clientMode: state => {
      if (state.clientWidth < 576) {
        return 'MOBILE';
      } else if (state.clientWidth < 1600) {
        return 'DESKTOP';
      } else {
        return 'LARGE_DESKTOP';  // TODO change name in future
      }
    }
  }
});

export default store