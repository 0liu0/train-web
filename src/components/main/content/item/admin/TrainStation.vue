<template>
  <a-button style="float: left;margin: -10px 0 20px 40px" @click="showAddPsgModal">新增</a-button>
  <!-- 用户列表主体部分 -->
  <a-table style="padding: 0 20px" :columns="columns" :data-source="passengerList" :pagination="pagination"
           @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'trainCode'">
        <span>
          <smile-outlined/>
          车次编号
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'code'">
        <a>
          {{ record.trainCode }}
        </a>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button class="btn" type="primary" @click="showUpdPsgModal(record.id)">修改</a-button>
          <a-popconfirm title="确定要删除此数据吗？" @confirm="deleteInfo(record.id)" okText="确认"
                        cancel-text="取消">
            <template #icon><question-circle-outlined style="color: red"/></template>
            <a-button class="btn" type="primary" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
  <!-- 弹窗 -->
  <!-- 新建火车车站信息弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="新增" v-model:open="addPsgState" title="新增火车车站信息" @ok="addFormState">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <selectStationInput :treeData='metaList' @getTrainCodeInfo="getTrainCodeInfo"/>
        </a-form-item>
        <a-form-item label="站序">
          <a-input v-model:value="formState.stationIndex"/>
        </a-form-item>
        <a-form-item label="站名">
          <a-input v-model:value="formState.name"/>
        </a-form-item>
        <a-form-item label="站名拼音">
          <a-input v-model:value="formState.namePinyin" disabled/>
        </a-form-item>
        <a-form-item label="进站时间">
          <a-time-picker v-model:value="timeTemp.inTime" format="HH:mm:ss" placeholder="选择进站时间"/>
        </a-form-item>
        <a-form-item label="出站时间">
          <a-time-picker v-model:value="timeTemp.outTime" format="HH:mm:ss" placeholder="选择出站时间"/>
        </a-form-item>
        <a-form-item label="停站时常">
          <a-input v-model:value="timeTemp.stopTime" placeholder="停站时常" disabled/>
        </a-form-item>
        <a-form-item label="里程">
          <a-input v-model:value="formState.km" placeholder="KM"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 修改火车车站信息弹窗 -->
  <div>
    <a-modal cancel-text="取消" ok-text="修改" v-model:open="updPsgState" title="修改火车车站信息" @ok="updateForm">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="车次编号">
          <a-input v-model:value="formState.trainCode"/>
        </a-form-item>
        <a-form-item label="站序">
          <a-input v-model:value="formState.stationIndex"/>
        </a-form-item>
        <a-form-item label="站名">
          <a-input v-model:value="formState.name"/>
        </a-form-item>
        <a-form-item label="站名拼音">
          <a-input v-model:value="formState.namePinyin" disabled/>
        </a-form-item>
        <a-form-item label="进站时间">
          <a-time-picker v-model:value="timeTemp.inTime" format="HH:mm:ss" placeholder="选择进站时间"/>
        </a-form-item>
        <a-form-item label="出站时间">
          <a-time-picker v-model:value="timeTemp.outTime" format="HH:mm:ss" placeholder="选择出站时间"/>
        </a-form-item>
        <a-form-item label="停站时常">
          <a-input v-model:value="timeTemp.stopTime" disabled/>
        </a-form-item>
        <a-form-item label="里程">
          <a-input v-model:value="formState.km" placeholder="KM"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import myAxios from "@/utils/myAxios";
import {message} from "ant-design-vue";
import store from "@/store";
import dayjs from "dayjs";
import SelectStationInput from "@/components/main/content/item/components/SelectStationInput.vue";
import {pinyin} from "pinyin-pro";

let curPassengerId = ref(0);
let addPsgState = ref(false)
let updPsgState = ref(false)
const columns = [
  {
    name: '车次编号',
    dataIndex: 'trainCode',
    key: 'trainCode',
  },
  {
    title: '站序',
    dataIndex: 'stationIndex',
    key: 'stationIndex',
  }, {
    title: '站名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '站名拼音',
    dataIndex: 'namePinyin',
    key: 'namePinyin',
  }, {
    title: '进站时间',
    dataIndex: 'inTime',
    key: 'inTime',
  }, {
    title: '出站时间',
    dataIndex: 'outTime',
    key: 'outTime',
  }, {
    title: '停站时常',
    dataIndex: 'stopTime',
    key: 'stopTime',
  }, {
    title: '里程（公里）',
    dataIndex: 'km',
    key: 'km',
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
const passengerList = ref([])
const initialFormState = {
  id: '',
  trainCode: '',
  stationIndex: '',
  name: '',
  namePinyin: '',
  inTime: '',
  outTime: '',
  stopTime: '',
  km: ''
};
const timeTemp = reactive({
  inTime: '',
  outTime: '',
  stopTime: '00:00:00'
})
let formState = reactive({...initialFormState});
const metaList = ref([]);

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
  getTrainCodeMeta()
  fetchData()
})

// ----------------------------------------
const fetchData = () => {
  myAxios.post("/business/trainStation_station/query", {
    size: pagination.pageSize,
    page: pagination.current
  }).then(resp => {
    if (resp.data.code === 0) {
      if (resp.data.content === null) {
        passengerList.value = null
      } else {
        passengerList.value = resp.data.content.list;
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
// 执行对火车车站信息的一些基本操作
const updateForm = () => {
  // 格式化时间为后端所需格式
  formState.inTime = dayjs(timeTemp.inTime).locale('zh-cn').format('HH:mm:ss');
  formState.outTime = dayjs(timeTemp.outTime).locale('zh-cn').format('HH:mm:ss');
  formState.stopTime = timeTemp.stopTime;
  myAxios.post("/business/trainStation_station/update", formState).then(resp => {
    if (resp.data.code === 0) {
      message.success("修改火车车站信息成功")
      fetchData()
      updPsgState.value = false
    } else {
      message.warn(resp.data.message)
    }
  })
}

const deleteInfo = (id) => {
  myAxios.get(`/business/trainStation_station/delete/${id}`).then(resp => {
    if (resp.data.code === 0) {
      message.success("删除成功！")
      fetchData()
    } else {
      message.warn("系统繁忙，请稍后再试！")
    }
  })
}

const addFormState = () => {
  // 校验参数是否合法 todo
  // 将会员id传入
  formState.memberId = store.state.member.id
  // 格式化时间为后端所需格式
  formState.inTime = dayjs(timeTemp.inTime).locale('zh-cn').format('HH:mm:ss');
  formState.outTime = dayjs(timeTemp.outTime).locale('zh-cn').format('HH:mm:ss');
  formState.stopTime = timeTemp.stopTime;
  // 保存至数据库
  myAxios.post("/business/trainStation_station/save", formState).then(resp => {
    if (resp.data.code === 0) {
      message.success("新增火车车站信息成功")
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
  formState = {...initialFormState}
}
const showUpdPsgModal = (id) => {
  curPassengerId.value = id;

  myAxios.get(`/business/trainStation_station/get/${id}`).then(resp => {
    if (resp.data.code === 0) {
      const info = resp.data.content;
      formState.id = info.id;
      formState.trainCode = info.trainCode;
      formState.stationIndex = info.stationIndex;
      formState.name = info.name;
      formState.namePinyin = info.namePinyin;
      formState.inTime = info.inTime;
      formState.outTime = info.outTime;
      formState.stopTime = info.stopTime;
      formState.km = info.km;
      updPsgState.value = true;
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
}
const getTrainCodeInfo = (data) => {
  formState.trainCode = data
}
const getTrainCodeMeta = () => {
  myAxios.get(`/business/train/get/train_codes`).then(resp => {
    if (resp.data.code === 0) {
      metaList.value = resp.data.content
    } else {
      message.warn("网络繁忙，请稍后再试！");
    }
  });
}
// ===================================watch
// 自动计算停车时长
watch(() => timeTemp.inTime, () => {
  let diff = dayjs(timeTemp.outTime, 'HH:mm:ss').diff(dayjs(timeTemp.inTime, 'HH:mm:ss'), 'seconds');
  timeTemp.stopTime = dayjs('00:00:00', 'HH:mm:ss').second(diff).format('HH:mm:ss');
}, {immediate: true})
watch(() => timeTemp.outTime, () => {
  let diff = dayjs(timeTemp.outTime, 'HH:mm:ss').diff(dayjs(timeTemp.inTime, 'HH:mm:ss'), 'seconds');
  timeTemp.stopTime = dayjs('00:00:00', 'HH:mm:ss').second(diff).format('HH:mm:ss');
}, {immediate: true})
// ---------------------计算属性-------------------------
formState.namePinyin = computed({
  get() {
    return pinyin(formState.name, {toneType: 'none'}).replaceAll(" ", "")
  }, set(v) {
  }
})
</script>

<style scoped>
.btn {
  margin-right: 10px;
}
</style>