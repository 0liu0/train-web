<template>
  <a-layout-header class="header">
    <div class="logo"> 欢迎来到12306 </div>
    <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="1">
        <router-link to="/content">首页</router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/about">关于我们</router-link>
      </a-menu-item>
<!--      <a-menu-item key="3">-->
<!--        <router-link to="/bi/user">用户中心</router-link>-->
<!--      </a-menu-item>-->
<!--      <a-menu-item v-if="store.state.member.mail==='706716852@qq.com' key="4">-->
<!--        <router-link to="/bi/admin">管理菜单</router-link>-->
<!--      </a-menu-item>-->
    </a-menu>
  </a-layout-header>
</template>

<script setup>
import {ref} from "vue";
import store from "@/store";

const selectedKeys1 = ref(['1']);

</script>

<style scoped>
#components-layout-demo-top-side .logo {
  float: left;
  width: 120px;
  height: 31px;
  color: #00a6bc;
  margin-right: 80px;
//background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

#components-layout-demo-top-side {
  background: #d7e7f5;
}
</style>