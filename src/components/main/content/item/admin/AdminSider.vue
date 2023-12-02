<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKeys"
            @select="changeContent"
            mode="inline"
            style="height: 100%"
    >
      <a-menu-item key="1" @click="navigateTo('/admin/station-manage')">
        <FundOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp车站管理</span>
      </a-menu-item>
      <a-menu-item key="2" @click="navigateTo('/admin/train-manage')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车管理</span>
      </a-menu-item>
      <a-menu-item key="3" @click="navigateTo('/admin/train-carriage')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车车厢</span>
      </a-menu-item>
      <a-menu-item key="4" @click="navigateTo('/admin/train-seat')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车座位</span>
      </a-menu-item>
      <a-menu-item key="5" @click="navigateTo('/admin/train-station')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车车站</span>
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