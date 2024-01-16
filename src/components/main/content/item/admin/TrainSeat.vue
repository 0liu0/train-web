<template>
  <div style="float: left;margin: -10px 0 20px 40px">
    <SelectTrainCodeInput
      style="width:250px"
      :treeData="trainCodeMetaList"
      @getTrainCodeInfo="getTrainCodeInfoBySearch"
    />
    <a-button type="primary" @click="fetchData()" style="margin-left:20px">查找</a-button>
    <a-button type="primary" @click="showAddPsgModal" style="margin-left:20px">新增</a-button>
  </div>

  <!-- <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddPsgModal">新增</a-button> -->
  <!-- 用户列表主体部分 -->
  <a-table
    style="padding: 0 20px"
    :columns="columns"
    :data-source="passengerList"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'trainCode'">
        <span>
          <smile-outlined />车次编号
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'code'">
        <a>{{ record.trainCode }}</a>
      </template>
      <template v-if="column.key === 'seatType'">
        <a>{{ getTrainSeatType(record.seatType) }}</a>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-popconfirm
            title="确定要删除此数据吗？"
            @confirm="deleteSeat(record.id)"
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
  <!-- 新建座位弹窗 -->
  <div>
    <a-modal
      cancel-text="取消"
      ok-text="新增"
      v-model:open="addPsgState"
      title="新增座位"
      @ok="addPassenger"
    >
      <a-form :model="addFormState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="addFormState.trainCode" />
        </a-form-item>
        <a-form-item label="车次类型">
          <a-input v-model:value="addFormState.carriageIndex" />
        </a-form-item>
        <a-form-item label="始发站">
          <a-input v-model:value="addFormState.row" />
        </a-form-item>
        <a-form-item label="始发站拼音">
          <a-input v-model:value="addFormState.col" />
        </a-form-item>
        <a-form-item label="出发时间">
          <a-input v-model:value="addFormState.seatType" />
        </a-form-item>
        <a-form-item label="终点站">
          <a-input v-model:value="addFormState.carriageSeatIndex" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改座位信息弹窗 -->
  <div>
    <a-modal
      cancel-text="取消"
      ok-text="修改"
      v-model:open="updPsgState"
      title="修改座位信息"
      @ok="updPassengerInfo"
    >
      <a-form :model="curPassengerInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="curPassengerInfo.trainCode" />
        </a-form-item>
        <a-form-item label="车次类型">
          <a-input v-model:value="curPassengerInfo.carriageIndex" />
        </a-form-item>
        <a-form-item label="始发站">
          <a-input v-model:value="curPassengerInfo.row" />
        </a-form-item>
        <a-form-item label="始发站拼音">
          <a-input v-model:value="curPassengerInfo.col" />
        </a-form-item>
        <a-form-item label="出发时间">
          <a-input v-model:value="curPassengerInfo.seatType" />
        </a-form-item>
        <a-form-item label="终点站">
          <a-input v-model:value="curPassengerInfo.carriageSeatIndex" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import myAxios from "@/utils/myAxios";
import { message } from "ant-design-vue";
import store from "@/store";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";

let curPassengerId = ref(0);
let addPsgState = ref(false);
let updPsgState = ref(false);
const trainCodeMetaList = ref([]);
const columns = [
  {
    name: "车次编号",
    dataIndex: "trainCode",
    key: "trainCode"
  },
  {
    title: "厢序",
    dataIndex: "carriageIndex",
    key: "carriageIndex"
  },
  {
    title: "排号",
    dataIndex: "row",
    key: "row"
  },
  {
    title: "列号",
    dataIndex: "col",
    key: "col"
  },
  {
    title: "座位类型",
    dataIndex: "seatType",
    key: "seatType"
  },
  {
    title: "同车厢座序",
    dataIndex: "carriageSeatIndex",
    key: "carriageSeatIndex"
  },
  {
    title: "操作",
    key: "action"
  }
];
let loading = ref(false);
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
  trainCode: "",
  carriageIndex: "",
  row: "",
  col: "",
  seatType: "",
  carriageSeatIndex: ""
};
let params = ref({
  trainCode: null
});
const addFormState = reactive({ ...initialFormState });

// 每次用完都要重制当前的默认错参数
function resetFormState() {
  Object.keys(initialFormState).forEach(key => {
    addFormState[key] = initialFormState[key];
  });
}

let curPassengerInfo = reactive({ ...initialFormState });

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
});
onMounted(() => {
  getTrainCodeMeta();
  fetchData();
});

// ----------------------------------------
const fetchData = () => {
  loading.value = true;
  myAxios
    .post("/business/train_seat/query", {
      size: pagination.pageSize,
      page: pagination.current,
      trainCode: params.value.trainCode
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
// 执行对座位的一些基本操作
const updPassengerInfo = () => {
  myAxios.post("/business/train_seat/update", curPassengerInfo).then(resp => {
    if (resp.data.code === 0) {
      message.success("修改座位信息成功");
      fetchData();
      updPsgState.value = false;
    } else {
      message.warn(resp.data.message);
    }
  });
};

const deleteSeat = id => {
  myAxios.get(`/business/train_seat/delete/${id}`).then(resp => {
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
  myAxios.post("/business/train_seat/save", addFormState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增座位成功");
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

  myAxios.get(`/business/train_seat/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const info = resp.data.content;
      curPassengerInfo.id = info.id;
      curPassengerInfo.trainCode = info.trainCode;
      curPassengerInfo.carriageIndex = info.carriageIndex;
      curPassengerInfo.row = info.row;
      curPassengerInfo.col = info.col;
      curPassengerInfo.seatType = info.seatType;
      curPassengerInfo.carriageSeatIndex = info.carriageSeatIndex;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
};

const getTrainSeatType = type => {
  const typeMap = {
    "1": "一等座",
    "2": "二等座",
    "3": "软卧",
    "4": "软卧"
  };
  return typeMap[type] || "未知";
};
const getTrainCodeMeta = () => {
  myAxios.get(`/business/train/get/train_codes`).then(resp => {
    if (resp.data.code === 0) {
      trainCodeMetaList.value = resp.data.content
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
}
const getTrainCodeInfoBySearch = (data) => {
  params.value.trainCode = data
}
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>