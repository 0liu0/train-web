<template>
  <a-tree-select
      v-model:value="value"
      v-model:searchValue="searchValue"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="props.treeData"
      tree-node-filter-prop="label"
  >
    <template #title="{ value: val, label }">
      <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
      <template v-else>
        <template
            v-for="(fragment, i) in label
            .toString()
            .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
        >
          <span
              v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
              :key="i"
              style="color: #08c"
          >
            {{ fragment }}
          </span>
          <template v-else>{{ fragment }}</template>
        </template>
      </template>
    </template>
  </a-tree-select>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps(['treeData'])
const value = ref();
// const treeData = ref([
//   {
//     label: 'parent 1',
//     value: 'parent 1'
//   }, {
//     label: 'parent 2',
//     value: 'parent 2'
//   }, {
//     label: 'parent 3',
//     value: 'parent 3'
//   }, {
//     label: 'parent 4',
//     value: 'parent 4'
//   }
// ]);
watch(value, () => {
  console.log(value.value);
});
const searchValue = ref('');

// onMounted(() => {
//   getStationMeta()
// })

</script>

<style scoped>

</style>