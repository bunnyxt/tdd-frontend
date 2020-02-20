import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiBase: "https://api.bunnyxt.com/tdd/",
    //apiBase: "http://localhost/tdd/", // debug
    isMenuSliderVisible: false,
    isLoginSliderVisible: false,
    isVideoDetailDrawerVisible: false,
    videoDetailDrawerVideo: null,
    videoDetailVideo: null,
    memberDetailMember: null,
    isUserLoggedIn: false,
    clientWidth: 0
  },
  mutations: {
    changeMenuSliderVisibility(state) {
      state.isMenuSliderVisible = !state.isMenuSliderVisible;
    },
    changeLoginSliderVisibility(state) {
      state.isLoginSliderVisible = !state.isLoginSliderVisible;
    },
    changeVideoDetailDrawerVisibility(state) {
      state.isVideoDetailDrawerVisible = !state.isVideoDetailDrawerVisible;
    },
    setVideoDetailDrawerVisibility(state, visibility) {
      state.isVideoDetailDrawerVisible = visibility;
    },
    setVideoDetailDrawerVideo(state, video) {
      state.videoDetailDrawerVideo = video;
    },
    setVideoDetailVideo(state, video) {
      state.videoDetailVideo = video;
    },
    setMemberDetailMember(state, member) {
      state.memberDetailMember = member;
    },
    setClientWidth(state, clientWidth) {
      state.clientWidth = clientWidth;
    },
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