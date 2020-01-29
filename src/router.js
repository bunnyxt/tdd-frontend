import Vue from "vue";
import Router from "vue-router";
const Home = () => import("./components/Home");
const VideoHome = () => import("./components/VideoHome");
const VideoDetail = () => import("./components/VideoDetail");
const SprintHome = () => import("./components/SprintHome");
const SprintVideoDetail = () =>import("./components/SprintVideoDetail");
const SprintDailyHome = () => import("./components/SprintDailyHome");
const SprintDailyDetail = () => import("./components/SprintDailyDetail");
const ToolHome = () => import("./components/tool/ToolHome");
const DateCalc = () => import("./components/tool/DateCalc");
const BiliApi = () => import("./components/tool/BiliApi");
const AboutHome = () => import("./components/about/AboutHome");
const UpdateLog = () => import("./components/about/UpdateLog");
const NotFound = () => import("./components/NotFound");

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            component: Home
        }, {
            path: "/index.html",
            redirect: "/"
        }, {
            path: "/video",
            component: VideoHome
        }, {
            path: "/video/av:aid",
            component: VideoDetail
        }, {
            path: "/sprint",
            component: SprintHome
        }, {
            path: "/sprint/av:aid",
            component: SprintVideoDetail
        }, {
            path: "/sprint/daily",
            component: SprintDailyHome
        }, {
            path: "/sprint/daily/:date",
            component: SprintDailyDetail
        }, {
            path: "/tool",
            component: ToolHome
        }, {
            path: "/tool/datecalc",
            component: DateCalc
        }, {
            path: "/tool/biliapi",
            component: BiliApi
        }, {
            path: "/about",
            component: AboutHome
        }, {
            path: "/about/updatelog",
            component: UpdateLog
        }, {
            path: "*",
            component: NotFound
        }
    ]
});