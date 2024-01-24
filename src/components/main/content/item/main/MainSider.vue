<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKey"
            @select="changeContent"
            mode="inline"
            style="height: 100%"
    >
      <a-menu-item key="1" @click="navigateTo('/content/member-center')">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp我的乘车人</span>
      </a-menu-item>
      <a-menu-item key="2" @click="navigateTo('/content/member-ticket')">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp我要购票</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import router from "@/router";
import {onMounted, ref} from "vue";
const selectedKey = ref(['1']);
const arr = ['/content/member-center', '/content/member-ticket']
// 初始化时从localStorage读取selectedKey
onMounted(() => {
    selectedKey.value = [1];
    navigateTo('/content/member-center')
});

const navigateTo = (route) => {
  router.push(route);
};
</script>

<style scoped>

</style>