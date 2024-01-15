<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKey" @select="changeContent" mode="inline" style="height: 100%">
      <!-- 火车基本信息数据管理菜单 -->
      <a-sub-menu key="sub1">
        <template #title>
          <span>
            <user-outlined />&nbsp&nbsp&nbsp&nbsp&nbsp火车数据管理
          </span>
        </template>
        <a-menu-item key="1" @click="navigateTo('/admin/station-manage')">
          <FundOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp车站管理</span>
        </a-menu-item>
        <a-menu-item key="2" @click="navigateTo('/admin/train-manage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车管理</span>
        </a-menu-item>
        <a-menu-item key="3" @click="navigateTo('/admin/train-carriage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车车厢</span>
        </a-menu-item>
        <a-menu-item key="4" @click="navigateTo('/admin/train-station')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车车站</span>
        </a-menu-item>
        <a-menu-item key="5" @click="navigateTo('/admin/train-seat')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车座位</span>
        </a-menu-item>
      </a-sub-menu>
      <!-- 火车每日数据管理菜单 -->
      <a-sub-menu key="sub2">
        <template #title>
          <span>
            <user-outlined />&nbsp&nbsp&nbsp&nbsp&nbsp每日数据管理
          </span>
        </template>
        <a-menu-item key="6" @click="navigateTo('/admin/daily-train-manage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp每日火车</span>
        </a-menu-item>
        <a-menu-item key="7" @click="navigateTo('/admin/daily-train-carriage-manage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp每日车厢</span>
        </a-menu-item>
        <a-menu-item key="8" @click="navigateTo('/admin/daily-train-seat-manage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp每日车座</span>
        </a-menu-item>
        <a-menu-item key="9" @click="navigateTo('/admin/daily-train-station-manage')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp每日车站</span>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <template #title>
          <span>
            <user-outlined />&nbsp&nbsp&nbsp&nbsp&nbsp任务调度管理
          </span>
        </template>
        <a-menu-item key="10" @click="navigateTo('/admin/job-task')">
          <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}" />
          <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp定时任务</span>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import router from "@/router";
import { onMounted, ref } from "vue";

const selectedKey = ref(["1"]);
const arr = [
  "/admin/station-manage",
  "/admin/train-manage",
  "/admin/train-carriage",
  "/admin/train-seat",
  "/admin/train-station",
  "/admin/daily-train-manage",
  "/admin/daily-train-carriage-manage",
  "/admin/daily-train-seat-manage",
  "/admin/daily-train-station-manage",
  "/admin/job-task",
];
// 初始化时从localStorage读取selectedKey
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedKeyForAdmin");
  if (storedSelectedKey) {
    selectedKey.value = [storedSelectedKey];
    navigateTo(arr[storedSelectedKey - 1]);
  } else {
    const index = selectedKey.value[0] - 1;
    navigateTo(arr[index]);
  }
});

const changeContent = info => {
  selectedKey.value = [info.key];
  // 选项改变时更新localStorage
  localStorage.setItem("selectedKeyForAdmin", info.key);
};

const navigateTo = route => {
  router.push(route);
};
</script>

<style scoped>
</style>