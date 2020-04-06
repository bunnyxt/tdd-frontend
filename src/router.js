import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import("./components/page/Home");
const VideoHome = () => import("./components/page/video/VideoHome");
const VideoDetail = () => import("./components/page/video/VideoDetail");
const MemberHome = () => import("./components/page/member/MemberHome");
const MemberDetail = () => import("./components/page/member/MemberDetail");
const SprintHome = () => import("./components/page/sprint/SprintHome");
const SprintVideoDetail = () => import("./components/page/sprint/SprintVideoDetail");
const SprintDailyHome = () => import("./components/page/sprint/daily/SprintDailyHome");
const SprintDailyDetail = () => import("./components/page/sprint/daily/SprintDailyDetail");
const ToolHome = () => import("./components/page/tool/ToolHome");
const DateCalc = () => import("./components/page/tool/DateCalc");
const BiliApi = () => import("./components/page/tool/BiliApi");
const ZkCalc = () => import("./components/page/tool/ZkCalc");
const AidBvidConvert = () => import("./components/page/tool/AidBvidConvert");
const AboutHome = () => import("./components/page/about/AboutHome");
const UpdateLog = () => import("./components/page/about/UpdateLog");
const MeHome = () => import("./components/page/me/MeHome");
const MeSetting = () => import("./components/page/me/MeSetting");
const MeFavoriteVideo = () => import("./components/page/me/MeFavoriteVideo");
const MeFavoriteMember = () => import("./components/page/me/MeFavoriteMember");
const NotFound = () => import("./components/page/NotFound");

Vue.use(VueRouter);

const SITE_NAME = '天钿Daily';
const SITE_NAME_LONG = '天钿Daily - VC数据交流与分享';

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Home,
      meta: {
        title: SITE_NAME_LONG
      }
    }, {
      path: "/index.html",
      redirect: "/"
    }, {
      path: "/video",
      component: VideoHome,
      meta: {
        title: '视频 - ' + SITE_NAME,
        keepAlive: true
      }
    }, {
      path: "/video/av:aid",
      component: VideoDetail,
      meta: {
        title: '视频详情 - ' + SITE_NAME
      }
    }, {
      path: "/member",
      component: MemberHome,
      meta: {
        title: 'UP主 - ' + SITE_NAME,
        keepAlive: true
      }
    }, {
      path: "/member/:mid",
      component: MemberDetail,
      meta: {
        title: 'UP主详情 - ' + SITE_NAME
      }
    }, {
      path: "/sprint",
      component: SprintHome,
      meta: {
        title: '传说助攻 - ' + SITE_NAME,
        keepAlive: true
      }
    }, {
      path: "/sprint/av:aid",
      component: SprintVideoDetail,
      meta: {
        title: '助攻详情 - ' + SITE_NAME
      }
    }, {
      path: "/sprint/daily",
      component: SprintDailyHome,
      meta: {
        title: '助攻日报 - ' + SITE_NAME
      }
    }, {
      path: "/sprint/daily/:date",
      component: SprintDailyDetail,
      meta: {
        title: '助攻日报 - ' + SITE_NAME
      }
    }, {
      path: "/tool",
      component: ToolHome,
      meta: {
        title: '辅助工具 - ' + SITE_NAME
      }
    }, {
      path: "/tool/datecalc",
      component: DateCalc,
      meta: {
        title: '耗时计算 - ' + SITE_NAME
      }
    }, {
      path: "/tool/biliapi",
      component: BiliApi,
      meta: {
        title: 'Bilibili API传送门 - ' + SITE_NAME
      }
    }, {
      path: "/tool/zkcalc",
      component: ZkCalc,
      meta: {
        title: '周刊算分 - ' + SITE_NAME
      }
    }, {
      path: "/tool/abid",
      component: AidBvidConvert,
      meta: {
        title: 'av号/bv号转换 - ' + SITE_NAME
      }
    }, {
      path: "/about",
      component: AboutHome,
      meta: {
        title: '关于 - ' + SITE_NAME
      }
    }, {
      path: "/about/updatelog",
      component: UpdateLog,
      meta: {
        title: '更新日志 - ' + SITE_NAME
      }
    }, {
      path: "/me",
      component: MeHome,
      meta: {
        title: '个人中心 - ' + SITE_NAME,
        roles: ['ROLE_user']
      }
    }, {
      path: "/me/favorite/video",
      component: MeFavoriteVideo,
      meta: {
        title: '关注视频 - ' + SITE_NAME,
        roles: ['ROLE_user']
      }
    }, {
      path: "/me/favorite/member",
      component: MeFavoriteMember,
      meta: {
        title: '关注UP主 - ' + SITE_NAME,
        roles: ['ROLE_user']
      }
    }, {
      path: "/me/setting",
      component: MeSetting,
      meta: {
        title: '设置 - ' + SITE_NAME,
        roles: ['ROLE_user']
      }
    }, {
      path: "*",
      component: NotFound,
      meta: {
        title: '404 - ' + SITE_NAME
      }
    }
  ]
});