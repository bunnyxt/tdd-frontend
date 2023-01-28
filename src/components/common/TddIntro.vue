<i18n src="@/i18n/common.json"></i18n>
<i18n>
{
  "zh": {
    "tdd_introduction_brief": "致力于推动VC相关数据交流，定期抓取VC相关数据，选取有意义的纬度展示。",
    "know_more": "了解更多",
    "contact_us": "联系我们",
    "qq_group": "QQ群",
    "personal_email": "个人邮箱"
  },
  "en": {
    "tdd_introduction_brief": "Committed to enhance VOCALOID CHINA related data exchange, fetching VC related data regularly and show meaningful parts to everyone.",
    "know_more": "Know More",
    "contact_us": "Contact Us",
    "qq_group": "QQ Group",
    "personal_email": "Personal E-mail"
  }
}
</i18n>

<template>
  <div class="intro-text">
    <h1>{{ $t('tdd') }}</h1>
    <div 
      v-if="$store.getters.clientMode === 'MOBILE'"
      class="intro-brief-mobile"
    >
      {{ $t('tdd_introduction_brief') }}
    </div>
    <p v-else>
      {{ $t('tdd_introduction_brief') }}
    </p>
    <div class="intro-buttons">
      <a-button 
        type="primary"
        @click="() => $router.push('/about')"
      >
        {{ $t('know_more') }}
      </a-button>
      <a-popover
        :title="$t('contact_us')"
        trigger="hover"
        placement="bottom"
      >
        <template #content>
          <div>
            {{ $t('qq_group') }}{{ $t('colon') }}
            <a
              target="_blank"
              href="https://jq.qq.com/?_wv=1027&k=588s7nw"
            >537793686</a>
            <qrcode-outlined class="qrcode-icon" />
            <a
              target="_blank"
              :href="qqgroup_qrcode"
            >{{ $t('qr_code') }}</a>
            <br>
            {{ $t('personal_email') }}{{ $t('colon') }}
            <a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
          </div>
        </template>
        <a-button class="contact-button">
          {{ $t('contact_us') }}
        </a-button>
      </a-popover>
    </div>
  </div>
  <div class="intro-image">
    <img
      :src="logo_max"
      alt="logo"
    >
  </div>
</template>

<script>
import logo_max from '../../assets/img/logo_max.png'
import qqgroup_qrcode from '../../assets/img/qrcode_1580391374617.jpg'
import { QrcodeOutlined } from "@ant-design/icons-vue";

export default {
  name: 'TddIntro',
  components: {
    QrcodeOutlined,
  },
  data: function () {
    return {
      logo_max,
      qqgroup_qrcode,
    }
  },
};
</script>

<style scoped>
.intro-text {
  float: left;
  width: 60%;
}
.intro-brief-mobile {
  height: 42px; 
  overflow-x: scroll;
}
.intro-buttons {
  margin-top: 20px;
}
.qrcode-icon {
  margin-left: 8px;
  margin-right: 4px;
}
.contact-button {
  margin-left: 8px;
}
.intro-image {
  float: left;
  width: 40%;
  text-align: center;
}
.intro-image img {
  margin: auto;
  width: 60%;
}

@media only screen and (max-width: 576px) {
  .intro-text {
    width: 100%;
  }
  .intro-image {
    display: none;
  }
}
</style>
