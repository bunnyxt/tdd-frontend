<template>
  <a-locale-provider :locale="locale">
    <a-layout class="layout" style="min-height:100%">
      <tdd-menu-slider />
      <tdd-login-slider />
      <a-layout>
        <tdd-header />
        <a-layout-content :style="{padding: layoutPadding}">
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
    layoutPadding: function() {
      let width = this.$store.state.clientWidth;
      if (width < 576) {
        return '0 8px'
      } else if (width < 768) {
        return '0 20px'
      } else {
        return '0 50px'
      }
    }
  },
  mounted: function(){
    var that = this;

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
.slider-open-icon {
  position: fixed;
  top: 92px;
  background: #001529;
  width: 36px;
  height: 42px;
  color: #ffffff;
  font-size: 18px;
  border-radius: 0 4px 4px 0;
  text-align: center;
  cursor: pointer;
  line-height: 42px;
  transition: background .3s ease;
  z-index: 100;
}
.slider-open-icon:hover {
  background: #192c3e;
}
.fake-footer{
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
/* MOBILE version */
@media only screen and (max-width: 576px) {
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
  p {
    margin-bottom: 4px !important;
  }
  h1 {
    margin-bottom: 8px !important;
  }
}
</style>
