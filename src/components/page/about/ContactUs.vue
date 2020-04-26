<template>
  <div>
    <div class="tdd-breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/about">关于</router-link></a-breadcrumb-item>
        <a-breadcrumb-item>联系我们</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="section-block">
      <h1>联系我们</h1>
      <p>感谢您对天钿Daily的支持！天钿Daily目前由站长<a href="https://www.bunnyxt.com" target="_blank">bunnyxt</a>一人开发、维护、运营，您可以通过以下方式与本站取得联系：</p>
      <ul>
        <li>
          官方QQ群：<a target="_blank" href="https://jq.qq.com/?_wv=1027&k=588s7nw">537793686</a><a-icon type="qrcode" style="margin-left: 8px; margin-right: 4px"/><a target="_blank" :href="qqgroup_qrcode">二维码</a>
        </li>
        <li>
          站长个人邮箱：<a href="mailto:bunnyxt@outlook.com">bunnyxt@outlook.com</a>
        </li>
        <li>
          本站管理员邮箱：<a href="mailto:admin@bunnyxt.com">admin@bunnyxt.com</a>
        </li>
      </ul>
      <p>如果您对本站的技术实现感兴趣，可以关注以下链接：</p>
      <ul>
        <li>
          站长GitHub主页：<a target="_blank" href="https://github.com/bunnyxt">https://github.com/bunnyxt</a>
        </li>
        <li>
          本项目GitHub Project主页：<a target="_blank" href="https://github.com/users/bunnyxt/projects/1">https://github.com/users/bunnyxt/projects/1</a>
        </li>
      </ul>
      <p>站长个人活跃平台：</p>
      <ul>
        <li>
          新浪微博：<a target="_blank" href="https://weibo.com/nny29">@牛奶源29</a>
        </li>
        <li>
          BiliBili：<a target="_blank" href="https://space.bilibili.com/1635775">@牛奶源</a>
        </li>
        <li>
          Twitter：<a target="_blank" href="https://twitter.com/bunnyxt29">@bunnyxt29</a>
        </li>
      </ul>
      <p>欢迎各位对本项目提出您的意见与建议，您的反馈对本站未来的发展非常重要！如果您喜欢本项目，也可以通过<a href="https://afdian.net/@bunnyxt" target="_blank">爱发电</a>资助本站。再次感谢您对天钿Daily的支持！希望这个小项目能对您有所帮助~</p>
    </div>
  </div>
</template>

<script>
  import qqgroup_qrcode from '../../../assets/img/qrcode_1580391374617.jpg'

  export default {
    name: 'ContactUs',
    data: function () {
      return {
        qqgroup_qrcode: qqgroup_qrcode
      }
    }
  }
</script>

<style scoped>

</style>
