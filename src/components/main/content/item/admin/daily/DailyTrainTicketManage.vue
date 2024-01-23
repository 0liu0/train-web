<template>
  <p style="float: left">
    <a-space>
      <SelectTrainCodeInput style="width:230px" :treeData="trainCodeMetaList" @getTrainCodeInfo="getTrainCodeInfoBySearch" tag="查询列车"/>
      <a-date-picker v-model:value="params.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期"></a-date-picker>
      <selectStationInput style="width:230px" :treeData="metaList" @getStationStartInfo="getStationStartInfo" tag="选择出发站" />
      <selectStationInput style="width:230px" :treeData="metaList" @getStationEndInfo="getStationEndInfo" tag="选择终点站" />
      <a-button style="width:80px" type="primary" @click="handleQuery()">查找</a-button>
    </a-space>
  </p>
  <a-table :dataSource="dailyTrainTickets"
           :columns="columns"
           :pagination="pagination"
           @change="handleTableChange"
           :loading="loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
      </template>
      <template v-else-if="column.dataIndex === 'station'">
        {{record.start}}<br/>
        {{record.end}}
      </template>
      <template v-else-if="column.dataIndex === 'time'">
        {{record.startTime}}<br/>
        {{record.endTime}}
      </template>
      <template v-else-if="column.dataIndex === 'duration'">
        {{calDuration(record.startTime, record.endTime)}}<br/>
        <div v-if="record.startTime.replaceAll(':', '') >= record.endTime.replaceAll(':', '')">
          次日到达
        </div>
        <div v-else>
          当日到达
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'ydz'">
        <div v-if="record.ydz >= 0">
          {{record.ydz}}<br/>
          {{record.ydzPrice}}￥
        </div>
        <div v-else>
          --
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'edz'">
        <div v-if="record.edz >= 0">
          {{record.edz}}<br/>
          {{record.edzPrice}}￥
        </div>
        <div v-else>
          --
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'rw'">
        <div v-if="record.rw >= 0">
          {{record.rw}}<br/>
          {{record.rwPrice}}￥
        </div>
        <div v-else>
          --
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'yw'">
        <div v-if="record.yw >= 0">
          {{record.yw}}<br/>
          {{record.ywPrice}}￥
        </div>
        <div v-else>
          --
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import {message, notification} from "ant-design-vue";
import myAxios from "@/utils/myAxios";
import {onMounted, ref} from "vue";
import dayjs from "dayjs";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";
import SelectStationInput from "@/components/main/content/item/components/SelectStationInput.vue";
const metaList = ref([]);
const trainCodeMetaList = ref([]);
const visible = ref(false);
let dailyTrainTicket = ref({
  id: undefined,
  date: undefined,
  trainCode: undefined,
  start: undefined,
  startPinyin: undefined,
  startTime: undefined,
  startIndex: undefined,
  end: undefined,
  endPinyin: undefined,
  endTime: undefined,
  endIndex: undefined,
  ydz: undefined,
  ydzPrice: undefined,
  edz: undefined,
  edzPrice: undefined,
  rw: undefined,
  rwPrice: undefined,
  yw: undefined,
  ywPrice: undefined,
  createTime: undefined,
  updateTime: undefined,
});
const dailyTrainTickets = ref([]);
// 分页的三个属性名是固定的
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
});
let loading = ref(false);
const params = ref({});
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '车次编号',
    dataIndex: 'trainCode',
    key: 'trainCode',
  },
  {
    title: '车站',
    dataIndex: 'station',
  },
  {
    title: '时间',
    dataIndex: 'time',
  },
  {
    title: '历时',
    dataIndex: 'duration',
  },
  {
    title: '一等座',
    dataIndex: 'ydz',
    key: 'ydz',
  },
  {
    title: '二等座',
    dataIndex: 'edz',
    key: 'edz',
  },
  {
    title: '软卧',
    dataIndex: 'rw',
    key: 'rw',
  }, {
    title: '硬卧',
    dataIndex: 'yw',
    key: 'yw',
  }
];


const handleQuery = (param) => {
  if (!param) {
    param = {
      page: 1,
      size: pagination.value.pageSize
    };
  }
  loading.value = true;
  myAxios.get("/business/admin/daily-train-ticket/query-list", {
    params: {
      page: param.page,
      size: param.size,
      trainCode: params.value.trainCode,
      date: params.value.date,
      start: params.value.start,
      end: params.value.end
    }
  }).then((response) => {
    loading.value = false;
    let data = response.data;
    if (data.success) {
      dailyTrainTickets.value = data.content.list;
      // 设置分页控件的值
      pagination.value.current = param.page;
      pagination.value.total = data.content.total;
    } else {
      notification.error({description: data.message});
    }
  });
};
const getStationMeta = () => {
  myAxios.get("/business/station/station_label/list").then(resp => {
    if (resp.data.code === 0) {
      metaList.value = resp.data.content;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
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
const handleTableChange = (page) => {
  // console.log("看看自带的分页参数都有啥：" + JSON.stringify(page));
  pagination.value.pageSize = page.pageSize;
  handleQuery({
    page: page.current,
    size: page.pageSize
  });
};

const calDuration = (startTime, endTime) => {
  let diff = dayjs(endTime, 'HH:mm:ss').diff(dayjs(startTime, 'HH:mm:ss'), 'seconds');
  return dayjs('00:00:00', 'HH:mm:ss').second(diff).format('HH:mm:ss');
};
const getStationStartInfo = data => {
  params.value.start = data;
};
const getStationEndInfo = data => {
  params.value.end = data;
};
const getTrainCodeInfoBySearch = (data) => {
  params.value.trainCode = data
}
onMounted(() => {
  getStationMeta();
  getTrainCodeMeta()
  handleQuery({
    page: 1,
    size: pagination.value.pageSize
  });
});
</script>

<style scoped>

</style>