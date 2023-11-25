import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from "@/views/MainView.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainView,
    children: [
      {
        path: 'about',
        name: 'about',
        component: ()=> import("../components/main/content/AboutView.vue")
      }, {
        path: 'content',
        name: 'content',
        component: ()=> import("../components/main/content/MainContent.vue"),
        children: [
          {
            path: 'member-center',
            name: 'member-center',
            component: () => import("../components/main/content/item/MemberCenter.vue")
          },
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import(/* webpackChunkName: "about" */ '../views/main/WelcomeView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
