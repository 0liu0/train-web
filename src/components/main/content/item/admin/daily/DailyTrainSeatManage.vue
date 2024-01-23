<template>
  <p>
    <a-space>
      <SelectTrainCodeInput tag="选择车次" style="width:250px" :treeData='trainCodeMetaList' @getTrainCodeInfo="getTrainCodeInfoBySearch"/>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
    </a-space>
  </p>
  <a-table
    :dataSource="dailyTrainSeats"
    :columns="columns"
    :pagination="pagination"
    @change="handleTableChange"
    :loading="loading"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'"></template>
      <template v-else-if="column.dataIndex === 'col'">
        <span v-for="item in SEAT_COL_ARRAY" :key="item.code">
          <span v-if="item.code === record.col && item.type === record.seatType">{{item.desc}}</span>
        </span>
      </template>
      <template v-else-if="column.dataIndex === 'seatType'">
        <span v-for="item in SEAT_TYPE_ARRAY" :key="item.code">
          <span v-if="item.code === record.seatType">{{item.desc}}</span>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { notification } from "ant-design-vue";
import myAxios from "../../../../../../utils/myAxios";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";
const SEAT_COL_ARRAY = window.SEAT_COL_ARRAY;
const SEAT_TYPE_ARRAY = window.SEAT_TYPE_ARRAY;
const visible = ref(false);
const trainCodeMetaList = ref([]);
let dailyTrainSeat = ref({
  id: undefined,
  date: undefined,
  trainCode: undefined,
  carriageIndex: undefined,
  row: undefined,
  col: undefined,
  seatType: undefined,
  carriageSeatIndex: undefined,
  sell: undefined,
  createTime: undefined,
  updateTime: undefined
});
const dailyTrainSeats = ref([]);
// 分页的三个属性名是固定的
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
let loading = ref(false);
let params = ref({
  trainCode: null
});
const columns = [
  {
    title: "日期",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "车次编号",
    dataIndex: "trainCode",
    key: "trainCode"
  },
  {
    title: "箱序",
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
    title: "同车箱座序",
    dataIndex: "carriageSeatIndex",
    key: "carriageSeatIndex"
  },
  {
    title: "售卖情况",
    dataIndex: "sell",
    key: "sell"
  }
];

const handleQuery = param => {
  if (!param) {
    param = {
      page: 1,
      size: pagination.value.pageSize
    };
  }
  loading.value = true;
  myAxios
    .get("/business/admin/daily-train-seat/query-list", {
      params: {
        page: param.page,
        size: param.size,
        trainCode: params.value.trainCode
      }
    })
    .then(response => {
      loading.value = false;
      let data = response.data;
      if (data.success) {
        dailyTrainSeats.value = data.content.list;
        // 设置分页控件的值
        pagination.value.current = param.page;
        pagination.value.total = data.content.total;
      } else {
        notification.error({ description: data.message });
      }
    });
};

const handleTableChange = page => {
  console.log("pagination::", pagination.value.current);
  console.log("pagination::", pagination.value.pageSize);
  console.log("看看自带的分页参数都有啥：" + JSON.stringify(page));
  pagination.value.current = page.current;
  pagination.value.pageSize = page.pageSize
  handleQuery({
    page: page.current,
    size: page.pageSize
  });
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
  console.log("getTrainCodeInfo")
}
onMounted(() => {
  getTrainCodeMeta()
  handleQuery({
    page: 1,
    size: pagination.value.pageSize
  });
});
</script>