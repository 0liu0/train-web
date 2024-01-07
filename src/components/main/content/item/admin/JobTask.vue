<template>
  <div class="btn-top">
    <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddModal" type="primary">新增</a-button>
    <a-button style="float: left;margin: -10px 0 5px 10px" @click="fetchData" type="primary">刷新</a-button>
  </div>
  <!-- 列表主体部分 -->
  <a-table style="padding: 0 20px" :columns="columns" :data-source="passengerList" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          定时任务描述
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="showUpdPsgModal(record.id)">修改</a-button>
          <a-popconfirm title="确定要删除此用户吗？" @confirm="deletePassenger(record.id)" okText="确认"
                        cancel-text="取消">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <!-- 弹窗 -->
  <!-- 新建定时任务弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="新增" v-model:open="addPsgState" title="新增车站信息" @ok="addPassenger">
      <a-form :model="addFormState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="站名">
          <a-input v-model:value="addFormState.name"/>
        </a-form-item>
        <a-form-item label="站名拼音">
          <a-input v-model:value="addFormState.namePinyin"/>
        </a-form-item>
        <a-form-item label="站名首字母拼音">
          <a-input v-model:value="addFormState.namePy"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>

// 分页相关操作
const handleTableChange = (newPagination) => {
  console.log("Changing page to", newPagination.current);
  // 更新当前页数
  pagination.current = newPagination.current;
  // 可选: 更新页面大小
  pagination.pageSize = newPagination.pageSize;
  // 重新请求数据
  fetchData();
}
</script>

<style scoped>

</style>