<template>
  <p>
    <a-space>
      <a-date-picker v-model:value="params.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期" />
      <SelectTrainCodeInput
        style="width:250px"
        :treeData="trainCodeMetaList"
        @getTrainCodeInfo="getTrainCodeInfoBySearch"
      />
      <a-button type="primary" @click="handleQuery()">查找</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table
    :dataSource="dailyTrainStations"
    :columns="columns"
    :pagination="pagination"
    @change="handleTableChange"
    :loading="loading"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <a-popconfirm
            title="删除后不可恢复，确认删除?"
            @confirm="onDelete(record)"
            ok-text="确认"
            cancel-text="取消"
          >
            <a style="color: red">删除</a>
          </a-popconfirm>
          <a @click="onEdit(record)">编辑</a>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="每日车站" @ok="handleOk" ok-text="确认" cancel-text="取消">
    <a-form :model="dailyTrainStation" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="日期">
        <a-date-picker
          v-model:value="dailyTrainStation.date"
          valueFormat="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      </a-form-item>
      <a-form-item label="车次编号">
        <SelectTrainCodeInput
          style="width:250px"
          :treeData="trainCodeMetaList"
          @getTrainCodeInfo="getTrainCodeInfoBySave"
        />
      </a-form-item>
      <a-form-item label="站序">
        <a-input v-model:value="dailyTrainStation.stationIndex" />
      </a-form-item>
      <a-form-item label="站名">
        <a-input v-model:value="dailyTrainStation.name" />
      </a-form-item>
      <a-form-item label="站名拼音">
        <a-input v-model:value="dailyTrainStation.namePinyin" disabled />
      </a-form-item>
      <a-form-item label="进站时间">
        <a-time-picker
          v-model:value="dailyTrainStation.inTime"
          valueFormat="HH:mm"
          placeholder="请选择时间"
        />
      </a-form-item>
      <a-form-item label="出站时间">
        <a-time-picker
          v-model:value="dailyTrainStation.outTime"
          valueFormat="HH:mm"
          placeholder="请选择时间"
        />
      </a-form-item>
      <a-form-item label="停站时长">
        <a-time-picker
          v-model:value="dailyTrainStation.stopTime"
          valueFormat="HH:mm"
          placeholder="请选择时间"
          disabled
        />
      </a-form-item>
      <a-form-item label="里程（公里）">
        <a-input v-model:value="dailyTrainStation.km" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { notification } from "ant-design-vue";
import { pinyin } from "pinyin-pro";
import dayjs from "dayjs";
import myAxios from "@/utils/myAxios";
import { Tool } from "@/utils/tool";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";
const trainCodeMetaList = ref([]);
const visible = ref(false);
let dailyTrainStation = ref({
  id: undefined,
  date: undefined,
  trainCode: undefined,
  stationIndex: undefined,
  name: undefined,
  namePinyin: undefined,
  inTime: undefined,
  outTime: undefined,
  stopTime: undefined,
  km: undefined,
  createTime: undefined,
  updateTime: undefined
});
const dailyTrainStations = ref([]);
// 分页的三个属性名是固定的
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10
});
let loading = ref(false);
let params = ref({
  trainCode: null,
  date: null
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
    title: "站序",
    dataIndex: "stationIndex",
    key: "stationIndex"
  },
  {
    title: "站名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "站名拼音",
    dataIndex: "namePinyin",
    key: "namePinyin"
  },
  {
    title: "进站时间",
    dataIndex: "inTime",
    key: "inTime"
  },
  {
    title: "出站时间",
    dataIndex: "outTime",
    key: "outTime"
  },
  {
    title: "停站时长",
    dataIndex: "stopTime",
    key: "stopTime"
  },
  {
    title: "里程（公里）",
    dataIndex: "km",
    key: "km"
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
];
watch(
  () => dailyTrainStation.value.name,
  () => {
    if (Tool.isNotEmpty(dailyTrainStation.value.name)) {
      dailyTrainStation.value.namePinyin = pinyin(
        dailyTrainStation.value.name,
        { toneType: "none" }
      ).replaceAll(" ", "");
    } else {
      dailyTrainStation.value.namePinyin = "";
    }
  },
  { immediate: true }
);

// 自动计算停车时长
watch(
  () => dailyTrainStation.value.inTime,
  () => {
    let diff = dayjs(dailyTrainStation.value.outTime, "HH:mm").diff(
      dayjs(dailyTrainStation.value.inTime, "HH:mm"),
      "seconds"
    );
    dailyTrainStation.value.stopTime = dayjs("00:00:00", "HH:mm")
      .second(diff)
      .format("HH:mm");
  },
  { immediate: true }
);

// 自动计算停车时长
watch(
  () => dailyTrainStation.value.outTime,
  () => {
    let diff = dayjs(dailyTrainStation.value.outTime, "HH:mm").diff(
      dayjs(dailyTrainStation.value.inTime, "HH:mm"),
      "seconds"
    );
    dailyTrainStation.value.stopTime = dayjs("00:00:00", "HH:mm")
      .second(diff)
      .format("HH:mm");
  },
  { immediate: true }
);

const onAdd = () => {
  dailyTrainStation.value = {};
  visible.value = true;
};

const onEdit = record => {
  dailyTrainStation.value = window.Tool.copy(record);
  visible.value = true;
};

const onDelete = record => {
  myAxios
    .delete("/business/admin/daily-train-station/delete/" + record.id)
    .then(response => {
      const data = response.data;
      if (data.success) {
        notification.success({ description: "删除成功！" });
        handleQuery({
          page: pagination.value.current,
          size: pagination.value.pageSize
        });
      } else {
        notification.error({ description: data.message });
      }
    });
};

const handleOk = () => {
  myAxios
    .post("/business/admin/daily-train-station/save", dailyTrainStation.value)
    .then(response => {
      let data = response.data;
      if (data.success) {
        notification.success({ description: "保存成功！" });
        visible.value = false;
        handleQuery({
          page: pagination.value.current,
          size: pagination.value.pageSize
        });
      } else {
        notification.error({ description: data.message });
      }
    });
};

const handleQuery = param => {
  if (!param) {
    param = {
      page: 1,
      size: pagination.value.pageSize
    };
  }
  loading.value = true;
  myAxios
    .get("/business/admin/daily-train-station/query-list", {
      params: {
        page: param.page,
        size: param.size,
        trainCode: params.value.trainCode,
        date: params.value.date
      }
    })
    .then(response => {
      loading.value = false;
      let data = response.data;
      if (data.success) {
        dailyTrainStations.value = data.content.list;
        // 设置分页控件的值
        pagination.value.current = param.page;
        pagination.value.total = data.content.total;
      } else {
        notification.error({ description: data.message });
      }
    });
};

const handleTableChange = pagination => {
  // console.log("看看自带的分页参数都有啥：" + pagination);
  handleQuery({
    page: pagination.current,
    size: pagination.pageSize
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
}
const getTrainCodeInfoBySave = (data) => {
  dailyTrainStation.value.trainCode = data
}
onMounted(() => {
  getTrainCodeMeta()
  handleQuery({
    page: 1,
    size: pagination.value.pageSize
  });
});
</script>
