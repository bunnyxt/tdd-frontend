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
    clientWidth: 0,
    isUserLoggedIn: false,
    userDetail: null,
    i18n: null,
  },
  mutations: {
    changeMenuSliderVisibility(state) {
      state.isMenuSliderVisible = !state.isMenuSliderVisible;
    },
    changeLoginSliderVisibility(state) {
      state.isLoginSliderVisible = !state.isLoginSliderVisible;
    },
    setLoginSliderVisibility(state, visibility) {
      state.isLoginSliderVisible = visibility;
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
    setUserLoginStatus(state, status) {
      state.isUserLoggedIn = status;
    },
    setUserDetail(state, detail) {
      state.userDetail = detail;
    },
    setI18n(state, i18n) {
      state.i18n = i18n;
    },
    setI18nLocale(state, locale) {
      if (state.i18n) {
        state.i18n.locale = locale;
      }
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
    },
    i18nLocale: state => {
      return state.i18n.locale;
    }
  }
});

export default store
