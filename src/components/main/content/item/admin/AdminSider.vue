<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKey"
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
      <a-menu-item key="4" @click="navigateTo('/admin/train-station')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车车站</span>
      </a-menu-item>
      <a-menu-item key="5" @click="navigateTo('/admin/train-seat')">
        <BarChartOutlined :style="{fontSize: '18px',color:'#08c'}"/>
        <span style="font-weight: 500">&nbsp&nbsp&nbsp&nbsp&nbsp火车座位</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import router from "@/router";
import {onMounted, ref} from "vue";

const selectedKey = ref(['1']);
const arr = ['/admin/station-manage', '/admin/train-manage', '/admin/train-carriage', '/admin/train-seat', '/admin/train-station']
// 初始化时从localStorage读取selectedKey
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedKeyForAdmin");
  if (storedSelectedKey) {
    selectedKey.value = [storedSelectedKey];
    navigateTo(arr[storedSelectedKey - 1])
  } else {
    const index = selectedKey.value[0] - 1
    navigateTo(arr[index])
  }
});

const changeContent = (info) => {
  selectedKey.value = [info.key];
  // 选项改变时更新localStorage
  localStorage.setItem("selectedKeyForAdmin", info.key);
};

const navigateTo = (route) => {
  router.push(route);
};
</script>

<style scoped>

</style>