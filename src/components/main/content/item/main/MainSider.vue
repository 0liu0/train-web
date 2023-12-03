<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu :selectedKeys="selectedKey"
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
import {onMounted, ref} from "vue";
const selectedKey = ref(['1']);
const arr = ['/content/member-center', '/admin/train-manage', '/admin/train-carriage', '/admin/train-seat', '/admin/train-station']
// 初始化时从localStorage读取selectedKey
onMounted(() => {
  const storedSelectedKey = localStorage.getItem("selectedKeyForMain");
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
  localStorage.setItem("selectedKeyForMain", info.key);
};
const navigateTo = (route) => {
  router.push(route);
};
</script>

<style scoped>

</style>