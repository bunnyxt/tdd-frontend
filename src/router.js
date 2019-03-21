import Vue from "vue";
import Router from "vue-router";

const Home = () => import("./components/Home");
const SprintHome = () => import("./components/SprintHome");

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            component: Home
        }, {
            path: "/sprint",
            component: SprintHome
        },
    ]
});