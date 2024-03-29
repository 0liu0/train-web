import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
import './assets/js/enums';
// 全局使用图标
const icons = Icons;
for (const i in icons){
    app.component(i, icons[i])
}
app.use(Antd).use(router).use(store).mount('#app');
console.log("环境：",process.env.NODE_ENV);
console.log("服务端：",process.env.VUE_APP_SERVER);