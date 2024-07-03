import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/MainPage.vue";
import MonitoringVue from "@/views/Monitoring.vue";
import TopicDetailVue from "@/components/TopicDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/list",
      name: "list",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MonitoringVue,
      props: true,
    },
    {
      path: "/topic",
      name: "topic",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/TopicMonitoring.vue"),
    },
    {
      path: "/topicDetail/:mainTopic",
      name: "topicDetail",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: TopicDetailVue,
      props: true,
    },
  ],
});

export default router;
