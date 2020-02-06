<template>
  <a-locale-provider :locale="locale">
    <a-layout class="layout" style="min-height:100%">
      <tdd-menu-slider />
      <tdd-login-slider />
      <a-layout>
        <tdd-header />
        <a-layout-content :style="{padding: layoutPadding, marginTop: layoutMarginTop}">
          <router-view></router-view>
        </a-layout-content>
        <div class="fake-footer"></div>
        <tdd-footer/>
        <a-back-top />
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import TddHeader from "./components/layout/TddHeader.vue";
import TddMenuSlider from "./components/layout/TddMenuSlider.vue";
import TddLoginSlider from "./components/layout/TddLoginSlider.vue";
import TddFooter from "./components/layout/TddFooter.vue";

export default {
  name: "app",
  components: {
    TddHeader,
    TddMenuSlider,
    TddLoginSlider,
    TddFooter
  },
  data: function() {
    return {
      locale: zhCN
    }
  },
  computed: {
    layoutPadding: function () {
      return this.$util.calcLayoutPadding(this.$store.state.clientWidth);
    },
    layoutMarginTop: function () {
      return this.$store.getters.clientMode === 'MOBILE' ? '64px' : '0';
    }
  },
  mounted: function(){
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
  }
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

/* fixed width-height ratio image */
.tdd-cover-pic {
  height: 0;
  position: relative;
  padding-bottom: 60%;
}
.tdd-cover-pic img {
  position: absolute;
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
