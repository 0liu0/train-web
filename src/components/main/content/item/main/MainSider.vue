<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKeys"
            @select="changeContent"
            mode="inline"
            style="height: 100%"
    >
      <a-menu-item key="1" @click="navigateTo('/content/member-center')">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp会员中心</span>
      </a-menu-item>
      <a-menu-item key="2" @click="navigateTo('/bi/content/gen-chart')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp创建图表</span>
      </a-menu-item>
      <a-menu-item key="3" @click="navigateTo('/bi/content/async-gen-chart')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp快速生成</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import router from "@/router";

const navigateTo = (route) => {
  router.push(route);
};
</script>

<style scoped>

</style>