<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddModal">新增</a-button>
  <a-button style="float: left;margin: -10px 0 5px 10px" @click="fetchData">刷新</a-button>
  <!-- 用户列表主体部分 -->
  <a-table style="padding: 0 20px" :columns="columns" :data-source="list" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'code'">
        <span>
          <smile-outlined/>
          车次编号
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'code'">
        <a>
          {{ record.code }}
        </a>
      </template>
      <template v-if="column.key === 'type'">
        <span>
            {{ getTrainType(record.type) }}
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="showUpdModal(record.id)">修改</a-button>
          <a-popconfirm title="确定要删除此数据吗？" @confirm="deletePassenger(record.id)" okText="确认"
                        cancel-text="取消">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <!-- 弹窗 -->
  <!-- 新建火车弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="新增" v-model:open="addState" title="新增火车信息" @ok="add">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="formState.code"/>
        </a-form-item>
        <a-form-item label="车次类型">
          <a-select v-model:value="formState.type" style="width: 100%">
            <a-select-option value="G">高铁</a-select-option>
            <a-select-option value="D">动车</a-select-option>
            <a-select-option value="K">快速</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="始发站">
          <selectStationInput :treeData = 'metaList' @getStationStartInfo="getStationStartInfo"/>
        </a-form-item>
        <a-form-item label="始发站拼音">
          <a-input v-model:value="formState.startPinyin" disabled/>
        </a-form-item>
        <a-form-item label="出发时间">
          <a-time-picker v-model:value="timeTemp.startTime" format="HH:mm:ss" placeholder="选择出发时间"/>
        </a-form-item>
        <a-form-item label="终点站">
          <selectStationInput :treeData = 'metaList' @getStationEndInfo="getStationEndInfo"/>
        </a-form-item>
        <a-form-item label="终点站拼音">
          <a-input v-model:value="formState.endPinyin" disabled/>
        </a-form-item>
        <a-form-item label="到站时间">
          <a-time-picker v-model:value="timeTemp.endTime" format="HH:mm:ss" placeholder="选择到站时间"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改火车信息弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="修改" v-model:open="updPsgState" title="修改火车信息" @ok="updPassengerInfo">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="formState.code"/>
        </a-form-item>
        <a-form-item label="车次类型">
          <a-select v-model:value="formState.type" style="width: 100%">
            <a-select-option value="G">高铁</a-select-option>
            <a-select-option value="D">动车</a-select-option>
            <a-select-option value="K">快速</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="始发站">
          <a-input v-model:value="formState.start"/>
        </a-form-item>
        <a-form-item label="始发站拼音">
          <a-input :value="formState.startPinyin" class="disabled-input" disabled/>
        </a-form-item>
        <a-form-item label="出发时间">
          <a-input v-model:value="formState.startTime"/>
        </a-form-item>
        <a-form-item label="重点站">
          <a-input v-model:value="formState.end"/>
        </a-form-item>
        <a-form-item label="终点站拼音">
          <a-input v-model:value="formState.endPinyin" class="disabled-input" disabled/>
        </a-form-item>
        <a-form-item label="到站时间">
          <a-input v-model:value="formState.endTime"/>
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
import {pinyin} from "pinyin-pro";
import dayjs from "dayjs";
import SelectStationInput from "@/components/main/content/item/components/SelectStationInput.vue";
dayjs.locale('zh-cn') // 使用本地化语言
let curId = ref(0);
let addState = ref(false)
let updPsgState = ref(false)
const metaList = ref([]);
const columns = [
  {
    name: '车次编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '车次类型',
    dataIndex: 'type',
    key: 'type',
  }, {
    title: '始发站',
    dataIndex: 'start',
    key: 'start',
  }, {
    title: '始发站拼音',
    dataIndex: 'startPinyin',
    key: 'startPinyin',
  }, {
    title: '出发时间',
    dataIndex: 'startTime',
    key: 'startTime',
  }, {
    title: '终点站',
    dataIndex: 'end',
    key: 'end',
  }, {
    title: '终点站拼音',
    dataIndex: 'endPinyin',
    key: 'endPinyin',
  }, {
    title: '到站时间',
    dataIndex: 'endTime',
    key: 'endTime',
  }, {
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
const list = ref([
  {
    id: '1',
    trainCode: '2',
    carriageIndex: '3',
    seatType: '4',
    seatCount: '5',
    rowCount: '6',
    colCount: '7'
  },
])
const initialFormState = {
  id: '',
  code: '',
  type: '',
  start: '',
  startPinyin: '',
  startTime: '',
  end: '',
  endPinyin: '',
  endTime: ''
};

const timeTemp = reactive({
  startTime:'',
  endTime:''
})

let formState = reactive({...initialFormState});
onMounted(() => {
  getStationMeta();
  console.log("metaList:" + metaList.value)
})
// 每次用完都要重制当前的默认错参数
function resetFormState() {
  Object.keys(initialFormState).forEach(key => {
    formState[key] = initialFormState[key];
  });
}

const pagination = reactive({
  current: 1, // 当前页数
  pageSize: 10, // 每页显示的记录数
  total: 0 // 总记录数
})
onMounted(() => {
  fetchData()
})
// -----------------------计算属性--------------------------
formState.startPinyin = computed({
  get() {
    return pinyin(formState.start, {toneType: 'none'}).replaceAll(" ", "")
  }, set(v) {
  }
})
formState.endPinyin = computed({
  get() {
    return pinyin(formState.end, {toneType: 'none'}).replaceAll(" ", "")
  }, set(v) {
  }
})

// -----------------------方法-----------------------------
const fetchData = () => {
  myAxios.post("/business/train/query", {
    size: pagination.pageSize,
    page: pagination.current
  }).then(resp => {
    if (resp.data.code === 0) {
      if (resp.data.content === null) {
        list.value = null
      } else {
        list.value = resp.data.content.list;
        pagination.total = parseInt(resp.data.content.total);
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
  myAxios.post("/business/train/update", formState).then(resp => {
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
  myAxios.get(`/business/train/delete/${id}`).then(resp => {
    if (resp.data.code === 0) {
      message.success("删除成功！")
      fetchData()
    } else {
      message.warn("系统繁忙，请稍后再试！")
    }
  })
}

const add = () => {
  // 校验参数是否合法 todo
  // 将会员id传入
  formState.memberId = store.state.member.id
  // resetFormState()
  // formState = {...initialFormState}
  // 格式化时间为后端所需格式
  formState.startTime = dayjs(timeTemp.startTime).locale('zh-cn').format('HH:mm:ss');
  formState.endTime= dayjs(timeTemp.endTime).locale('zh-cn').format('HH:mm:ss');
  console.log("formState:", formState)
  // 调用保存接口
  myAxios.post("/business/train/save", formState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增火车信息成功")
      fetchData()
      addState.value = false
      resetFormState()
    } else {
      message.warn(resp.data.message)
    }
  })
}

// 展示新增或修改菜单
const showAddModal = () => {
  addState.value = true
  resetFormState()
}
const showUpdModal = (id) => {
  curId.value = id;
  resetFormState()
  updPsgState.value = true;

  myAxios.get(`/business/train/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const info = resp.data.content;
      formState.id = info.id;
      formState.code = info.code;
      formState.type = info.type;
      formState.start = info.start;
      formState.startPinyin = info.startPinyin;
      formState.startTime = info.startTime;
      formState.end = info.end;
      formState.endPinyin = info.endPinyin;
      formState.endTime = info.endTime;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
}
const getStationMeta = ()=> {
  myAxios.get("/business/station/station_label/list").then(resp => {
    if (resp.data.code === 0) {
      metaList.value = resp.data.content;
    } else {
      message.warn("网络繁忙，请稍后再试！")
    }
  })
}
const getTrainType = (type) => {
  const typeMap = {
    'G': '高铁',
    'D': '动车',
    'K': '快速',
  };
  return typeMap[type] || '未知';
}
// --------------------------触发器------------------------------
const getStationStartInfo = (data)=> {
  formState.start = data
}
const getStationEndInfo = (data) => {
  console.log("wochufale")
  formState.end = data
}
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>