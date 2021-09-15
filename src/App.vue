<template>
  <a-config-provider :locale="locale">
    <a-layout class="layout" style="min-height:100%">
      <tdd-menu-slider @toggle-language-banner-visibility="toggleLanguageBannerVisibility" />
      <tdd-login-slider />
      <tdd-video-detail-drawer />
      <a-layout>
        <tdd-header ref="header" />
        <a-layout-content :style="{padding: layoutPadding, marginTop: layoutMarginTop, marginBottom: '-120px'}">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
        </a-layout-content>
        <div class="fake-footer"></div>
        <tdd-footer/>
        <a-back-top />
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';
import TddHeader from "./components/layout/TddHeader.vue";
import TddMenuSlider from "./components/layout/TddMenuSlider.vue";
import TddLoginSlider from "./components/layout/TddLoginSlider.vue";
import TddVideoDetailDrawer from "./components/common/TddVideoDetailDrawer";
import TddFooter from "./components/layout/TddFooter.vue";

export default {
  name: "app",
  components: {
    TddHeader,
    TddMenuSlider,
    TddLoginSlider,
    TddVideoDetailDrawer,
    TddFooter
  },
  computed: {
    layoutPadding: function () {
      return this.$util.calcLayoutPadding(this.$store.state.clientWidth);
    },
    layoutMarginTop: function () {
      return this.$store.getters.clientMode === 'MOBILE' ? '64px' : '0';
    },
    locale: function () {
      return this.$store.getters.i18nLocale === 'zh' ? zhCN : enUS;
    },
  },
  methods: {
    toggleLanguageBannerVisibility: function () {
      this.$refs.header.$refs.banner.showI18nLocaleSelect = !this.$refs.header.$refs.banner.showI18nLocaleSelect;  // bad design
    },
  },
  mounted: function () {
    let that = this;
    // global client mode
    let width = (document && document.body && document.body.clientWidth) || -1;
    if (width > 0) {
      that.$store.commit('setClientWidth', width);
    }
    window.addEventListener('resize', () => {
      let width = (document && document.body && document.body.clientWidth) || -1;
      if (width > 0) {
        that.$store.commit('setClientWidth', width);
      }
    });
  },
};
</script>

<style>
/* custom layout style*/
.fake-footer {
  height: 120px;
  z-index: -1;
}
.section-separator {
  height: 24px;
}
.section-block {
  background: #fff;
  padding: 24px
}
.tdd-breadcrumb {
  margin: 16px 0;
}
.ant-list-vertical .ant-list-item-content {
  margin-bottom: 0 !important;
}
.ant-pagination-options {
  display: inline-block;
}
.ant-pagination li {
  margin-bottom: 8px;
}
.bili-btn {
  /*border-color: #fb7299 !important;*/
  border-color: #fc82a5 !important;
  background-color: #fc82a5 !important;
  color: white !important;
}
.bili-btn:hover {
  border-color: #ff9db9 !important;
  background-color: #ff9db9 !important;
}
.bili-btn:active {
  border-color: #ff5a8a !important;
  background-color: #ff5a8a !important;
}

/* limit lime */
.line-1 {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.line-2 {
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* color system */
.color-0 {
  color: rgba(0, 0, 0, 0.65);
}
.color-1 {
  color: #d32f2f;
}
.color-2 {
  color: #f57c00;
}
.color-3 {
  color: #388e3c;
}
.color-4 {
  color: #1976d2;
}
.color-5 {
  color: #7b1fa2;
}
.bg-color-0 {
  background: rgba(0, 0, 0, 0.65);
}
.bg-color-1 {
  background: #d32f2f;
}
.bg-color-2 {
  background: #f57c00;
}
.bg-color-3 {
  background: #388e3c;
}
.bg-color-4 {
  background: #1976d2;
}
.bg-color-5 {
  background: #7b1fa2;
}

/* fixed width-height ratio image */
.tdd-cover-pic {
  height: 0;
  position: relative;
  padding-bottom: 60%;
}
.tdd-cover-pic img {
  position: absolute;
}

/* override user agent style */
h1 {
  font-size: 2em;
}

/* MOBILE version */
@media only screen and (max-width: 576px) {
  /* custom layout style*/
  .section-separator {
    height: 12px;
  }
  .section-block {
    padding: 8px;
  }
  .tdd-breadcrumb {
    margin: 8px 0;
  }
  .ant-list-lg .ant-list-item {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }
  .ant-timeline-item {
    padding-bottom: 8px;
  }
  p {
    margin-bottom: 4px !important;
  }
  h1 {
    margin-bottom: 8px !important;
  }
}
</style>
