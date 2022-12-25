import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../components/page/Home');
const VideoHome = () => import('../components/page/video/VideoHome');
const VideoDetail = () => import('../components/page/video/VideoDetail');
const MemberHome = () => import('../components/page/member/MemberHome');
const MemberDetail = () => import('../components/page/member/MemberDetail');
const RankHome = () => import('../components/page/rank/RankHome')
const SprintHome = () => import('../components/page/sprint/SprintHome');
const SprintVideoDetail = () => import('../components/page/sprint/SprintVideoDetail');
const SprintDailyHome = () => import('../components/page/sprint/daily/SprintDailyHome');
const SprintDailyDetail = () => import('../components/page/sprint/daily/SprintDailyDetail');
const ToolHome = () => import('../components/page/tool/ToolHome');
const DateCalc = () => import('../components/page/tool/DateCalc');
const BiliApi = () => import('../components/page/tool/BiliApi');
const ZkCalc = () => import('../components/page/tool/ZkCalc');
const AidBvidConvert = () => import('../components/page/tool/AidBvidConvert');
const TsConvert = () => import('../components/page/tool/TsConvert');
const VideoCompare = () => import('../components/page/tool/VideoCompare');
const TextAbidDescriptionReplacement = () => import('../components/page/tool/TextAbidDescriptionReplacement');
const AboutHome = () => import('../components/page/about/AboutHome');
const ContactUs = () => import('../components/page/about/ContactUs');
const UpdateLog = () => import('../components/page/about/UpdateLog');
const MeHome = () => import('../components/page/me/MeHome');
const MeSetting = () => import('../components/page/me/MeSetting');
const MeFavoriteVideo = () => import('../components/page/me/MeFavoriteVideo');
const MeFavoriteMember = () => import('../components/page/me/MeFavoriteMember');
const NotFound = () => import('../components/page/NotFound');

const router =  createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    }, {
      path: '/index.html',
      redirect: '/',
    }, {
      path: '/video',
      component: VideoHome,
      meta: {
        keepAlive: true,
      },
    }, {
      path: '/video/av:aid',
      component: VideoDetail,
    }, {
      path: '/video/bv:bvid',
      component: VideoDetail,
    }, {
      path: '/video/BV:bvid',
      component: VideoDetail,
    }, {
      path: '/member',
      component: MemberHome,
      meta: {
        keepAlive: true,
      },
    }, {
      path: '/member/:mid',
      component: MemberDetail,
    }, {
      path: '/rank/:category?/:archId?',
      component: RankHome,
    }, {
      path: '/sprint',
      component: SprintHome,
      meta: {
        keepAlive: true,
      },
    }, {
      path: '/sprint/av:aid',
      component: SprintVideoDetail,
    }, {
      path: '/sprint/daily',
      component: SprintDailyHome,
    }, {
      path: '/sprint/daily/:date',
      component: SprintDailyDetail,
    }, {
      path: '/tool',
      component: ToolHome,
    }, {
      path: '/tool/datecalc',
      component: DateCalc,
    }, {
      path: '/tool/biliapi',
      component: BiliApi,
    }, {
      path: '/tool/zkcalc',
      component: ZkCalc,
    }, {
      path: '/tool/abid',
      component: AidBvidConvert,
    }, {
      path: '/tool/ts',
      component: TsConvert,
    }, {
      path: '/tool/compare',
      component: VideoCompare,
    }, {
      path: '/tool/text-abid-description-replacement',
      component: TextAbidDescriptionReplacement,
    }, {
      path: '/about',
      component: AboutHome,
    }, {
      path: '/about/updatelog',
      component: UpdateLog,
    }, {
      path: '/about/contactus',
      component: ContactUs,
    }, {
      path: '/me',
      component: MeHome,
      meta: {
        roles: ['ROLE_user'],
      },
    }, {
      path: '/me/favorite/video',
      component: MeFavoriteVideo,
      meta: {
        roles: ['ROLE_user'],
      },
    }, {
      path: '/me/favorite/member',
      component: MeFavoriteMember,
      meta: {
        roles: ['ROLE_user'],
      }
    }, {
      path: '/me/setting',
      component: MeSetting,
      meta: {
        roles: ['ROLE_user'],
      }
    }, {
      path: '/:pathMatch(.*)*',
      component: NotFound,
    }
  ]
});

export default router;
