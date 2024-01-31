<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddPsgModal">新增</a-button>
  <!-- 用户列表主体部分 -->
  <a-table
      style="padding: 0 20px"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'trainCode'">
        <span>
          <smile-outlined/>车次编号
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'trainCode'">
        <a>{{ record.trainCode }}</a>
      </template>
      <template v-if="column.key === 'seatType'">
        <span>{{ getSeatType(record.seatType) }}</span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="showUpdPsgModal(record.id)">修改</a-button>
          <a-popconfirm
              title="确定要删除此数据吗？"
              @confirm="deletePassenger(record.id)"
              okText="确认"
              cancel-text="取消"
          >
            <template #icon>
              <question-circle-outlined style="color: red"/>
            </template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <!-- 弹窗 -->
  <!-- 新建车厢信息弹窗 -->
  <div>
    <a-modal
        cancel-text="取消"
        ok-text="新增"
        v-model:open="addPsgState"
        title="新增车厢"
        @ok="addPassenger"
    >
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <selectStationInput :treeData="metaList" @getTrainCodeInfo="getTrainCodeInfo"/>
        </a-form-item>
        <a-form-item label="厢号">
          <a-input v-model:value="formState.carriageIndex"/>
        </a-form-item>
        <a-form-item label="座位类型">
          <a-select v-model:value="formState.seatType" style="width: 100%">
            <a-select-option value="1">一等座</a-select-option>
            <a-select-option value="2">二等座</a-select-option>
            <a-select-option value="3">软卧</a-select-option>
            <a-select-option value="4">硬卧</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排数">
          <a-input v-model:value="formState.rowCount"/>
        </a-form-item>
        <a-form-item label="座位数">
          <a-input v-model:value="formState.seatCount" disabled/>
        </a-form-item>
        <a-form-item label="列数">
          <a-input v-model:value="formState.colCount" disabled/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改车厢信息弹窗 -->
  <div>
    <a-modal
        cancel-text="取消"
        ok-text="修改"
        v-model:open="updPsgState"
        title="修改车厢信息"
        @ok="updPassengerInfo"
    >
      <a-form :model="curCarriageInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="curCarriageInfo.trainCode" disabled/>
        </a-form-item>
        <a-form-item label="厢号">
          <a-input v-model:value="curCarriageInfo.carriageIndex"/>
        </a-form-item>
        <a-form-item label="座位类型">
          <a-select v-model:value="curCarriageInfo.seatType" style="width: 100%">
            <a-select-option value="1">一等座</a-select-option>
            <a-select-option value="2">二等座</a-select-option>
            <a-select-option value="3">软卧</a-select-option>
            <a-select-option value="4">硬卧</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排数">
          <a-input v-model:value="curCarriageInfo.rowCount"/>
        </a-form-item>
        <a-form-item label="座位数">
          <a-input v-model:value="curCarriageInfo.seatCount" disabled/>
        </a-form-item>
        <a-form-item label="列数">
          <a-input v-model:value="curCarriageInfo.colCount" disabled/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import store from "@/store";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectStationInput.vue";
import SelectStationInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";
import {pinyin} from "pinyin-pro";

let curPassengerId = ref(0);
let addPsgState = ref(false);
let updPsgState = ref(false);
const columns = [
  {
    name: "车次编号",
    dataIndex: "trainCode",
    key: "trainCode"
  },
  {
    title: "厢号",
    dataIndex: "carriageIndex",
    key: "carriageIndex"
  },
  {
    title: "座位类型",
    dataIndex: "seatType",
    key: "seatType"
  },
  {
    title: "座位数",
    dataIndex: "seatCount",
    key: "seatCount"
  },
  {
    title: "排数",
    dataIndex: "rowCount",
    key: "rowCount"
  },
  {
    title: "列数",
    dataIndex: "colCount",
    key: "colCount"
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
const list = ref([]);
const initialFormState = {
  id: "",
  trainCode: "",
  carriageIndex: "",
  seatType: "",
  seatCount: "",
  rowCount: "",
  colCount: ""
};

const formState = reactive({...initialFormState});

// 每次用完都要重制当前的默认错参数
function resetFormState() {
  Object.keys(initialFormState).forEach(key => {
    formState[key] = initialFormState[key];
  });
}

let curCarriageInfo = reactive({
  id: "",
  trainCode: "",
  carriageIndex: "",
  seatType: "",
  seatCount: "",
  rowCount: "",
  colCount: ""
});

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
});
onMounted(() => {
  getTrainCodeMeta();
  fetchData();
});
const getSeatType = type => {
  const typeMap = {
    "1": "一等座",
    "2": "二等座",
    "3": "软卧",
    "4": "硬卧"
  };
  return typeMap[type] || "未知";
};
const metaList = ref([]);
// ----------------------------------------
const fetchData = () => {
  loading.value = true;
  myAxios
      .post("/business/train_carriage/query", {
        size: pagination.pageSize,
        page: pagination.current
      })
      .then(resp => {
        loading.value = false;
        if (resp.data.code === 0) {
          if (resp.data.content === null) {
            list.value = null;
          } else {
            list.value = resp.data.content.list;
            pagination.total = parseInt(resp.data.content.total);
          }
        } else {
          message.error("网络错误，请重试！");
        }
      });
};
// 分页相关操作
const handleTableChange = newPagination => {
  // 更新当前页数
  pagination.current = newPagination.current;
  // 可选: 更新页面大小
  pagination.pageSize = newPagination.pageSize;
  // 重新请求数据
  fetchData();
};
// 执行对车厢的一些基本操作
const updPassengerInfo = () => {
  myAxios
      .post("/business/train_carriage/update", curCarriageInfo)
      .then(resp => {
        if (resp.data.code === 0) {
          message.success("修改车厢信息成功");
          fetchData();
          updPsgState.value = false;
        } else {
          message.warn(resp.data.message);
        }
      });
};

const deletePassenger = id => {
  myAxios.get(`/business/train_carriage/delete/${id}`).then(resp => {
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
  formState.memberId = store.state.member.id;
  // 保存至数据库
  myAxios.post("/business/train_carriage/save", formState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增车厢信息成功");
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

  myAxios.get(`/business/train_carriage/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const info = resp.data.content;
      curCarriageInfo.id = info.id;
      curCarriageInfo.trainCode = info.trainCode;
      curCarriageInfo.carriageIndex = info.carriageIndex;
      curCarriageInfo.seatType = info.seatType;
      curCarriageInfo.seatCount = info.seatCount;
      curCarriageInfo.rowCount = info.rowCount;
      curCarriageInfo.colCount = info.colCount;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
};
// 得到火车编号的集合
const getTrainCodeMeta = () => {
  myAxios.get(`/business/train/get/train_codes`).then(resp => {
    if (resp.data.code === 0) {
      metaList.value = resp.data.content;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
};
// ---------------------------------------------------------------------------
const getTrainCodeInfo = data => {
  formState.trainCode = data;
};
// ---------------------------------------------------------------------------计算属性
formState.seatCount = computed({
  get() {
    return formState.rowCount * formState.colCount;
  },
  set(v) {
  }
});
formState.colCount = computed({
  get() {
    if (formState.seatType === "1" || formState.seatType === "3") {
      return 4;
    } else if (formState.seatType === "2") {
      return 5;
    } else if (formState.seatType === "4") {
      return 6;
    } else {
      return 0;
    }
  },
  set(v) {
  }
});
curCarriageInfo.seatCount = computed({
  get() {
    return curCarriageInfo.rowCount * curCarriageInfo.colCount;
  },
  set(v) {
  }
});
curCarriageInfo.colCount = computed({
  get() {
    if (curCarriageInfo.seatType === "1" || curCarriageInfo.seatType === "3") {
      return 4;
    } else if (
        curCarriageInfo.seatType === "2"
    ) {
      return 5;
    } else if (curCarriageInfo.seatType === "4") {
      return 6;
    } else {
      return 0;
    }
  },
  set(v) {
  }
});
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>