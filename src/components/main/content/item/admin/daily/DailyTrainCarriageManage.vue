<template>
  <p>
    <a-space>
      <a-date-picker v-model:value="params.date" valueFormat="YYYY-MM-DD" placeholder="请选择日期" />
      <SelectTrainCodeInput tag="选择车次" style="width:250px" :treeData='trainCodeMetaList' @getTrainCodeInfo="getTrainCodeInfoBySearch"/>
      <a-button type="primary" @click="handleQuery()">查找</a-button>
      <a-button type="primary" @click="onAdd">新增</a-button>
    </a-space>
  </p>
  <a-table
    :dataSource="dailyTrainCarriages"
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
      <template v-else-if="column.dataIndex === 'seatType'">
        <span>
            {{ getSeatType(record.seatType) }}
        </span>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="visible" title="每日车箱" @ok="handleOk" ok-text="确认" cancel-text="取消">
    <a-form :model="dailyTrainCarriage" :label-col="{span: 4}" :wrapper-col="{ span: 20 }">
      <a-form-item label="日期">
        <a-date-picker
          v-model:value="dailyTrainCarriage.date"
          valueFormat="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      </a-form-item>
      <a-form-item label="车次编号">
        <SelectTrainCodeInput tag="选择车次" style="width:250px" :treeData='trainCodeMetaList' @getTrainCodeInfo="getTrainCodeInfoBySave"/>
      </a-form-item>
      <a-form-item label="箱序">
        <a-input v-model:value="dailyTrainCarriage.carriageIndex" />
      </a-form-item>
      <a-form-item label="座位类型">
          <a-select v-model:value="dailyTrainCarriage.seatType" style="width: 100%">
            <a-select-option value="1">一等座</a-select-option>
            <a-select-option value="2">二等座</a-select-option>
            <a-select-option value="3">软卧</a-select-option>
            <a-select-option value="4">硬卧</a-select-option>
          </a-select>
        </a-form-item>
      <!--<a-form-item label="座位数">-->
      <!--  <a-input v-model:value="dailyTrainCarriage.seatCount" />-->
      <!--</a-form-item>-->
      <a-form-item label="排数">
        <a-input v-model:value="dailyTrainCarriage.rowCount" />
      </a-form-item>
      <!--<a-form-item label="列数">-->
      <!--  <a-input v-model:value="dailyTrainCarriage.colCount" />-->
      <!--</a-form-item>-->
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {message, notification} from "ant-design-vue";
import myAxios from "../../../../../../utils/myAxios";
import SelectTrainCodeInput from "@/components/main/content/item/components/SelectTrainCodeInput.vue";
const visible = ref(false);
let dailyTrainCarriage = ref({
  id: undefined,
  date: undefined,
  trainCode: undefined,
  carriageIndex: undefined,
  seatType: undefined,
  seatCount: undefined,
  rowCount: undefined,
  colCount: undefined,
  createTime: undefined,
  updateTime: undefined
});
const dailyTrainCarriages = ref([]);
const trainCodeMetaList = ref([]);
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
    title: "箱序",
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
    dataIndex: "operation"
  }
];
const getSeatType = (type) => {
  const typeMap = {
    '1': '一等座',
    '2': '二等座',
    '3': '软卧',
    '4': '硬卧'
  };
  return typeMap[type] || '未知';
}
const onAdd = () => {
  dailyTrainCarriage.value = {};
  visible.value = true;
};

const onEdit = record => {
  dailyTrainCarriage.value = window.Tool.copy(record);
  visible.value = true;
};

const onDelete = record => {
  myAxios
    .delete("/business/admin/daily-train-carriage/delete/" + record.id)
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
    .post("/business/admin/daily-train-carriage/save", dailyTrainCarriage.value)
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
    .get("/business/admin/daily-train-carriage/query-list", {
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
        dailyTrainCarriages.value = data.content.list;
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
      notification.warn("网络繁忙，请稍后再试！");
    }
  });
}
const getTrainCodeInfoBySearch = (data) => {
  params.value.trainCode = data
}
const getTrainCodeInfoBySave = (data) => {
  dailyTrainCarriage.value.trainCode = data
}
onMounted(() => {
  getTrainCodeMeta()
  handleQuery({
    page: 1,
    size: pagination.value.pageSize
  });
});
</script>
