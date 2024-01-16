<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddPsgModal">新增</a-button>
  <!-- 用户列表主体部分 -->
  <a-table
    style="padding: 0 20px"
    :columns="columns"
    :data-source="passengerList"
    :pagination="pagination"
    @change="handleTableChange"
    :loading="loading"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />站名
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>{{ record.name }}</a>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="showUpdPsgModal(record.id)">修改</a-button>
          <a-popconfirm
            title="确定要删除此用户吗？"
            @confirm="deletePassenger(record.id)"
            okText="确认"
            cancel-text="取消"
          >
            <template #icon>
              <question-circle-outlined style="color: red" />
            </template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <!-- 弹窗 -->
  <!-- 新建乘客弹窗 -->
  <div>
    <a-modal
      cancel-text="取消"
      ok-text="新增"
      v-model:open="addPsgState"
      title="新增车站信息"
      @ok="addPassenger"
    >
      <a-form :model="addFormState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="站名">
          <a-input v-model:value="addFormState.name" />
        </a-form-item>
        <a-form-item label="站名拼音">
          <a-input v-model:value="addFormState.namePinyin" />
        </a-form-item>
        <a-form-item label="站名首字母拼音">
          <a-input v-model:value="addFormState.namePy" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改乘客信息弹窗 -->
  <div>
    <a-modal
      cancel-text="取消"
      ok-text="修改"
      v-model:open="updPsgState"
      title="修改乘客信息"
      @ok="updPassengerInfo"
    >
      <a-form :model="curPassengerInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="站名">
          <a-input v-model:value="curPassengerInfo.name" />
        </a-form-item>
        <a-form-item label="站名拼音">
          <a-input v-model:value="curPassengerInfo.namePinyin" />
        </a-form-item>
        <a-form-item label="站名拼音首字母">
          <a-input v-model:value="curPassengerInfo.namePy" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import myAxios from "@/utils/myAxios";
import { message } from "ant-design-vue";
import store from "@/store";
import { pinyin } from "pinyin-pro";

let curPassengerId = ref(0);
let addPsgState = ref(false);
let updPsgState = ref(false);
const columns = [
  {
    name: "站名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "站名拼音",
    dataIndex: "namePinyin",
    key: "idCard"
  },
  {
    title: "站名拼音首字母",
    dataIndex: "namePy",
    key: "mail"
  },
  {
    title: "操作",
    key: "action"
  }
];
const labelCol = {
  style: {
    width: "150px"
  }
};
const wrapperCol = {
  span: 14
};
const passengerList = ref([]);
const initialFormState = {
  id: "",
  name: "",
  namePinyin: "",
  namePy: ""
};
let loading = ref(false);
const addFormState = reactive({ ...initialFormState });
// ---------------------计算属性-------------------------
addFormState.namePinyin = computed({
  get() {
    return pinyin(addFormState.name, { toneType: "none" }).replaceAll(" ", "");
  },
  set(v) {}
});
addFormState.namePy = computed({
  get() {
    return pinyin(addFormState.name, {
      pattern: "first",
      toneType: "none"
    }).replaceAll(" ", "");
  },
  set(v) {}
});

// 每次用完都要重制当前的默认错参数
function resetFormState() {
  Object.keys(initialFormState).forEach(key => {
    addFormState[key] = initialFormState[key];
  });
}

let curPassengerInfo = reactive({
  id: "",
  name: "",
  namePinyin: "",
  namePy: ""
});

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
});
onMounted(() => {
  fetchData();
});

// ----------------------------------------
const fetchData = () => {
  loading.value = true;
  myAxios
    .post("/business/station/query", {
      size: pagination.pageSize,
      page: pagination.current
    })
    .then(resp => {
      loading.value = false;
      if (resp.data.code === 0) {
        if (resp.data.content === null) {
          passengerList.value = null;
        } else {
          passengerList.value = resp.data.content.list;
          pagination.total = parseInt(resp.data.content.total);
        }
      } else {
        message.error("网络错误，请重试！");
      }
    });
};
// 分页相关操作
const handleTableChange = newPagination => {
  console.log("Changing page to", newPagination.current);
  // 更新当前页数
  pagination.current = newPagination.current;
  // 可选: 更新页面大小
  pagination.pageSize = newPagination.pageSize;
  // 重新请求数据
  fetchData();
};
// 执行对乘客的一些基本操作
const updPassengerInfo = () => {
  myAxios.post("/business/station/update", curPassengerInfo).then(resp => {
    if (resp.data.code === 0) {
      message.success("修改乘客信息成功");
      fetchData();
      updPsgState.value = false;
    } else {
      message.warn(resp.data.message);
    }
  });
};

const deletePassenger = id => {
  myAxios.get(`/business/station/delete/${id}`).then(resp => {
    if (resp.data.code === 0) {
      message.success("删除成功！");
      fetchData();
    } else {
      message.warn("系统繁忙，请稍后再试！");
    }
  });
};

const addPassenger = () => {
  // 校验参数是否合法 todo
  // 将会员id传入
  addFormState.memberId = store.state.member.id;
  // 保存至数据库
  myAxios.post("/business/station/save", addFormState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增乘客成功");
      fetchData();
      addPsgState.value = false;
      resetFormState();
    } else {
      message.warn(resp.data.message);
    }
  });
};

// 展示新增或修改菜单
const showAddPsgModal = () => {
  addPsgState.value = true;
};
const showUpdPsgModal = id => {
  curPassengerId.value = id;
  updPsgState.value = true;

  myAxios.get(`/business/station/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const info = resp.data.content;
      curPassengerInfo.id = info.id;
      curPassengerInfo.name = info.name;
      curPassengerInfo.namePinyin = info.namePinyin;
      curPassengerInfo.namePy = info.namePy;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
};
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>