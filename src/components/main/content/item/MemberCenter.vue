<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="addPassenger">新增</a-button>
  <!-- 用户列表主体部分 -->
  <a-table style="padding: 0 20px" :columns="columns" :data-source="passengerList" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          昵称
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'role'">
        <span>
          <a-tag
              :color="record.role > 1 ? 'geekblue' : 'green'"
          >
            {{ getTagChinese(record.role) }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="upgradePassengerInfo(record.id)">修改</a-button>
          <a-popconfirm title="确定要删除此用户吗？" @confirm="deletePassenger(record.id)" okText="确认" cancel-text="取消">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <div>
    <!--            <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>-->
    <a-modal v-model:open="BIOpen" title="充值BI豆" @ok="BIHandleOk">
      <template #footer>
        <a-button key="back" @click="BIHandleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="BIHandleOk">充值</a-button>
      </template>
      <div>
        <a-input-number id="inputNumber" v-model:value="rechargeNum" :min="10"/>
        当前值：{{ rechargeNum }}粒
      </div>
    </a-modal>
  </div>
  <div>
    <!--            <a-button type="primary" @click="showModal">Open Modal with customized footer</a-button>-->
    <a-modal v-model:open="VIPOpen" title="充值会员" @ok="VIPHandleOk">
      <template #footer>
        <a-button key="back" @click="VIPHandleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="VIPHandleOk">充值</a-button>
      </template>
      <div>
        <a-input-number id="inputNumber" v-model:value="vipDate" :min="10"/>
        当前值：{{ vipDate }}月
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";

const columns = [
  {
    name: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '乘客类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作',
    key: 'action',
  },
];
const passengerList = ref([
  {
    id: 1,
    name: 'John Brown',
    idCard: 32,
    type: 'New York No. 1 Lake Park'
  },
])

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
})
onMounted(() => {
  fetchData()
})

// ----------------------------------------
const fetchData = ()=> {
  console.log("这是fetchData")
}
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

const upgradePassengerInfo = (id) => {

}

const deletePassenger = (id) => {

}

const addPassenger = () => {

}
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>