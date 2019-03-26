import Vue from "vue";
import Router from "vue-router";

const Home = () => import("./components/Home");
const SprintHome = () => import("./components/SprintHome");
const SprintVideoDetail = () =>import("./components/SprintVideoDetail");
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
            path: "*",
            component: NotFound
        }
    ]
});