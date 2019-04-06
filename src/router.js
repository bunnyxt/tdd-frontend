import Vue from "vue";
import Router from "vue-router";

const Home = () => import("./components/Home");
const SprintHome = () => import("./components/SprintHome");
const SprintVideoDetail = () =>import("./components/SprintVideoDetail");
const SprintDailyHome = () => import("./components/SprintDailyHome");
const SprintDailyDetail = () => import("./components/SprintDailyDetail");
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
            path: "*",
            component: NotFound
        }
    ]
});