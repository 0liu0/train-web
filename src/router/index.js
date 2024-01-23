import { createRouter, createWebHistory } from 'vue-router'
import MainView from "@/views/MainView.vue";
import store from "@/store";
import {message} from "ant-design-vue";

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
            component: () => import("../components/main/content/item/main/MemberCenter.vue")
          },
        ]
      }, {
        path: 'admin',
        name: 'admin',
        component: ()=> import("../components/main/content/AdminContent.vue"),
        children: [
          {
            path: 'station-manage',
            name: 'station-manage',
            component: () => import("../components/main/content/item/admin/StationManage.vue")
          },{
            path: 'train-manage',
            name: 'train-manage',
            component: () => import("../components/main/content/item/admin/TrainManage.vue")
          },{
            path: 'train-carriage',
            name: 'train-carriage',
            component: () => import("../components/main/content/item/admin/TrainCarriage.vue")
          },{
            path: 'train-seat',
            name: 'train-seat',
            component: () => import("../components/main/content/item/admin/TrainSeat.vue")
          },{
            path: 'train-station',
            name: 'train-station',
            component: () => import("../components/main/content/item/admin/TrainStation.vue")
          },{
            path: 'daily-train-manage',
            name: 'daily-train-manage',
            component: () => import("../components/main/content/item/admin/daily/DailyTrainManage.vue")
          },{
            path: 'daily-train-seat-manage',
            name: 'daily-train-seat-manage',
            component: () => import("../components/main/content/item/admin/daily/DailyTrainSeatManage.vue")
          },{
            path: 'daily-train-station-manage',
            name: 'daily-train-station-manage',
            component: () => import("../components/main/content/item/admin/daily/DailyTrainStationManage.vue")
          },{
            path: 'daily-train-carriage-manage',
            name: 'daily-train-carriage-manage',
            component: () => import("../components/main/content/item/admin/daily/DailyTrainCarriageManage.vue")
          },{
            path: 'daily-train-ticket-manage',
            name: 'daily-train-ticket-manage',
            component: () => import("../components/main/content/item/admin/daily/DailyTrainTicketManage.vue")
          },{
            path: 'job-task',
            name: 'job-task',
            component: () => import("../components/main/content/item/admin/JobTask.vue")
          }


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
// 添加全局路由守卫，没登录不能去其他页面，先这样做后续待优化
router.beforeEach(async (to, from) => {
  if (JSON.stringify(store.state.member) === "{}") {
    if (to.path !== '/login' && to.path !== '/registry') {
      message.warn("请先完成登录")
      return {path: '/login'}
    }
  }
  // 登录了之后防止返回啥的操作还会进入到登录界面
  if (JSON.stringify(store.state.member) !== "{}" && to.path === '/login') {
    return {path: '/'}
  }
})
export default router
