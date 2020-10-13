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
    // video compare related
    videoCompareList: null,
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
    // video compare related
    loadVideoCompareList: (state) => {
      if (!state.videoCompareList) {
        const tddVideoCompareList = localStorage.getItem('tddVideoCompareList');
        if (tddVideoCompareList) {
          state.videoCompareList = JSON.parse(tddVideoCompareList);
        } else {
          state.videoCompareList = [];
        }
      }
    },
    storeVideoCompareList: (state) => {
      localStorage.setItem('tddVideoCompareList', JSON.stringify(state.videoCompareList));
    },
    addCompareVideo (state, { aid, video, records }) {
      const item = state.videoCompareList.find(x => x.aid === aid);
      if (!item) {
        // add new
        state.videoCompareList.push({
          aid,
          video,
          records,
          config: {
            title: `av${aid}`,
            props: ['view'],
          }
        });
      } else {
        // update existed
        item.video = video;
        item.records = records;
      }
      localStorage.setItem('tddVideoCompareList', JSON.stringify(state.videoCompareList));
    },
    setCompareVideoConfig (state, { aid, config }) {
      const item = state.videoCompareList.find(x => x.aid === aid);
      if (item) {
        // update config
        item.config = config;
        localStorage.setItem('tddVideoCompareList', JSON.stringify(state.videoCompareList));
      }
    },
    removeCompareVideo (state, aid) {
      state.videoCompareList = state.videoCompareList.filter(x => x.aid !== aid);
      localStorage.setItem('tddVideoCompareList', JSON.stringify(state.videoCompareList));
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
    // video compare related
    getCompareVideoConfig: (state, aid) => {
      const item = state.videoCompareList.find(x => x.aid === aid);
      if (item) {
        return item.config;
      } else {
        return null;
      }
    },
  }
});

export default store
