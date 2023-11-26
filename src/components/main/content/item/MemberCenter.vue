<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddPsgModal">新增</a-button>
  <!-- 用户列表主体部分 -->
  <a-table style="padding: 0 20px" :columns="columns" :data-source="passengerList" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          乘客姓名
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'type'">
        <span>
          <a-tag
              :color="'green'"
          >
            {{ getTagChinese(record.type) }}
          </a-tag>
        </span>
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
  <!-- 新建乘客弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="新增" v-model:open="addPsgState" title="新增乘客" @ok="addPassenger">
      <a-form :model="addFormState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="乘客姓名">
          <a-input v-model:value="addFormState.name"/>
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input v-model:value="addFormState.idCard"/>
        </a-form-item>
        <a-form-item label="邮箱账号">
          <a-input v-model:value="addFormState.mail"/>
        </a-form-item>
        <a-form-item label="乘客类型">
          <a-select v-model:value="addFormState.type">
            <a-select-opt-group>
              <template #label>
                <span>
                  <user-outlined/>
                  乘客类型
                </span>
              </template>
              <a-select-option value="1">成人</a-select-option>
              <a-select-option value="2">儿童</a-select-option>
              <a-select-option value="3">学生</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改乘客信息弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="修改" v-model:open="updPsgState" title="修改乘客信息" @ok="updPassengerInfo">
      <a-form :model="curPassengerInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="乘客姓名">
          <a-input v-model:value="curPassengerInfo.name" readonly/>
        </a-form-item>
        <a-form-item label="身份证号">
          <a-input v-model:value="curPassengerInfo.idCard" readonly/>
        </a-form-item>
        <a-form-item label="邮箱账号">
          <a-input v-model:value="curPassengerInfo.mail"/>
        </a-form-item>
        <a-form-item label="乘客类型">
          <a-select v-model:value="curPassengerInfo.type">
            <a-select-opt-group>
              <template #label>
                <span>
                  <user-outlined/>
                  乘客类型
                </span>
              </template>
              <a-select-option value="1">成人</a-select-option>
              <a-select-option value="2">儿童</a-select-option>
              <a-select-option value="3">学生</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import store from "@/store";

let curPassengerId = ref(0);
let addPsgState = ref(false)
let updPsgState = ref(false)
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
  },  {
    title: '乘客邮箱',
    dataIndex: 'mail',
    key: 'mail',
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
const labelCol = {
  style: {
    width: '150px',
  },
};
const wrapperCol = {
  span: 14,
};
const passengerList = ref([
  {
    id: 1,
    name: 'John Brown',
    idCard: 32,
    type: 'New York No. 1 Lake Park'
  },
])
const initialFormState = {
  memberId: '',
  name: '',
  idCard: '',
  mail: '',
  type: ''
};

const addFormState = reactive({ ...initialFormState });
// 每次用完都要重制当前的默认错参数
function resetFormState() {
  Object.keys(initialFormState).forEach(key => {
    addFormState[key] = initialFormState[key];
  });
}
let curPassengerInfo = reactive({
  id: '',
  memberId: '',
  name: '',
  idCard: '',
  mail: '',
  type: ''
});

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
})
onMounted(() => {
  fetchData()
})

// ----------------------------------------
const getTagChinese = (tag) => {
  const tagMap = {
    1: '成人',
    2: '儿童',
    3: '学生'
  };
  return tagMap[tag] || '未知';
}
const fetchData = () => {
  myAxios.post("/member/passenger/get/list", {
    size: pagination.pageSize,
    page: pagination.current
  }).then(resp => {
    if (resp.data.code === 0) {
      if (resp.data.content===null) {
        passengerList.value = null
      } else {
        passengerList.value = resp.data.content.list;
        pagination.total = resp.data.content.total;
      }
    } else {
      message.error("网络错误，请重试！")
    }
  })
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
// 执行对乘客的一些基本操作
const updPassengerInfo = () => {
  myAxios.post("/member/passenger/update",curPassengerInfo).then(resp => {
    if (resp.data.code === 0) {
      message.success("修改乘客信息成功")
      fetchData()
      updPsgState.value = false
    } else {
      message.warn(resp.data.message)
    }
  })
}

const deletePassenger = (id) => {
  myAxios.get(`/member/passenger/delete/${id}`).then(resp => {
    if (resp.data.code === 0) {
      message.success("删除成功！")
      fetchData()
    }else {
      message.warn("系统繁忙，请稍后再试！")
    }
  })
}

const addPassenger = () => {
  // 校验参数是否合法 todo
  // 将会员id传入
  addFormState.memberId = store.state.member.id
  // 保存至数据库
  myAxios.post("/member/passenger/save", addFormState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增乘客成功")
      fetchData()
      addPsgState.value = false
      resetFormState()
    } else {
      message.warn(resp.data.message)
    }
  })
}

// 展示新增或修改菜单
const showAddPsgModal = () => {
  addPsgState.value = true
}
const showUpdPsgModal = (id) => {
  curPassengerId.value = id;
  updPsgState.value = true;

  myAxios.get(`/member/passenger/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const passengerInfo = resp.data.content;
      curPassengerInfo.id = passengerInfo.id;
      curPassengerInfo.memberId = passengerInfo.memberId;
      curPassengerInfo.name = passengerInfo.name;
      curPassengerInfo.idCard = passengerInfo.idCard;
      curPassengerInfo.mail = passengerInfo.mail;
      curPassengerInfo.type = passengerInfo.type;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
}

</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>