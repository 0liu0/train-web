<template>
  <div class="job">
    <p>
      <a-button type="primary" @click="handleAdd()">新增</a-button>&nbsp;
      <a-button type="primary" @click="handleQuery()">刷新</a-button>
    </p>
    <a-table :dataSource="jobs" :columns="columns" :loading="loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a-popconfirm
              title="手动执行会立即执行一次，确定执行？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleRun(record)"
            >
              <a-button type="primary" size="small">手动执行</a-button>
            </a-popconfirm>
            <a-popconfirm title="确定重启？" ok-text="是" cancel-text="否" @confirm="handleResume(record)">
              <a-button
                v-show="record.state === 'PAUSED' || record.state === 'ERROR'"
                type="primary"
                size="small"
              >重启</a-button>
            </a-popconfirm>
            <a-popconfirm title="确定暂停？" ok-text="是" cancel-text="否" @confirm="handlePause(record)">
              <a-button
                v-show="record.state === 'NORMAL' || record.state === 'BLOCKED'"
                type="primary"
                size="small"
              >暂停</a-button>
            </a-popconfirm>
            <a-button type="primary" @click="handleEdit(record)" size="small">编辑</a-button>
            <a-popconfirm
              title="删除后不可恢复，确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDelete(record)"
            >
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      title="新增定时任务"
      v-model:visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
    >
      <a-form :model="job" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="选择任务">
          <!-- <a-input v-model:value="job.name" @click="getJobInfo" /> -->
          <a-select
            v-model:value="job.name"
            show-search
            placeholder="选择一个定时任务"
            style="width: 200px"
            :options="jobList"
            @change="handleChange"
            @click="getJobInfo"
          ></a-select>
        </a-form-item>
        <a-form-item label="分组">
          <a-input v-model:value="job.group" :disabled="!!job.state" />
        </a-form-item>
        <a-form-item label="表达式">
          <a-input v-model:value="job.cronExpression" />
          <div class="ant-alert ant-alert-success">
            每5秒执行一次：0/5 * * * * ?
            <br />每5分钟执行一次：* 0/5 * * * ?
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { notification } from "ant-design-vue";
import myAxios from "@/utils/myAxios";
import { Tool } from "@/utils/tool";

export default defineComponent({
  name: "batch-job-view",
  setup() {
    const jobs = ref();
    const loading = ref();

    const columns = [
      {
        title: "分组",
        dataIndex: "group"
      },
      {
        title: "类名",
        dataIndex: "name"
      },
      {
        title: "描述",
        dataIndex: "description"
      },
      {
        title: "状态",
        dataIndex: "state"
      },
      {
        title: "表达式",
        dataIndex: "cronExpression"
      },
      {
        title: "上次时间",
        dataIndex: "preFireTime"
      },
      {
        title: "下次时间",
        dataIndex: "nextFireTime"
      },
      {
        title: "操作",
        dataIndex: "operation"
      }
    ];
    const jobList = ref([]);
    const jobDataInfo = ref();
    const handleQuery = () => {
      loading.value = true;
      jobs.value = [];
      myAxios.get("/batch/admin/job/query").then(response => {
        loading.value = false;
        const data = response.data;
        if (data.success) {
          jobs.value = data.content;
        } else {
          notification.error({ description: data.message });
        }
      });
    };

    // -------- 表单 ---------
    const job = ref();
    job.value = {};
    const modalVisible = ref(false);
    const modalLoading = ref(false);
    const handleModalOk = () => {
      modalLoading.value = true;
      let url = "add";
      if (job.value.state) {
        url = "reschedule";
      }
      console.log("job::", job.value);
      myAxios.post("/batch/admin/job/" + url, job.value).then(response => {
        modalLoading.value = false;
        const data = response.data;
        if (data.success) {
          modalVisible.value = false;
          notification.success({ description: "保存成功！" });
          handleQuery();
        } else {
          notification.error({ description: data.message });
        }
      });
    };

    /**
     * 新增
     */
    const handleAdd = () => {
      modalVisible.value = true;
      job.value = {
        group: "DEFAULT"
      };
    };

    /**
     * 编辑
     */
    const handleEdit = record => {
      modalVisible.value = true;
      job.value = Tool.copy(record);
    };

    /**
     * 删除
     */
    const handleDelete = record => {
      myAxios
        .post("/batch/admin/job/delete", {
          name: record.name,
          group: record.group
        })
        .then(response => {
          const data = response.data;
          if (data.success) {
            notification.success({ description: "删除成功！" });
            handleQuery();
          } else {
            notification.error({ description: data.message });
          }
        });
    };

    /**
     * 暂停
     */
    const handlePause = record => {
      myAxios
        .post("/batch/admin/job/pause", {
          name: record.name,
          group: record.group
        })
        .then(response => {
          const data = response.data;
          if (data.success) {
            notification.success({ description: "暂停成功！" });
            handleQuery();
          } else {
            notification.error({ description: data.message });
          }
        });
    };

    /**
     * 重启
     */
    const handleResume = record => {
      myAxios.post("/batch/admin/job/reschedule", record).then(response => {
        modalLoading.value = false;
        const data = response.data;
        if (data.success) {
          modalVisible.value = false;
          notification.success({ description: "重启成功！" });
          handleQuery();
        } else {
          notification.error({ description: data.message });
        }
      });
    };

    /**
     * 手动执行
     */
    const handleRun = record => {
      myAxios.post("/batch/admin/job/run", record).then(response => {
        const data = response.data;
        if (data.success) {
          notification.success({ description: "手动执行成功！" });
        } else {
          notification.error({ description: data.message });
        }
      });
    };

    const getEnumValue = (key, obj) => {
      return Tool.getEnumValue(key, obj);
    };

    const getJobInfo = () => {
      myAxios.get("/batch/admin/job/get/job-desc").then(resp => {
        const data = resp.data;
        if (data.success) {
          // 获取content
          // const contentObject = jsonObject.content;
          let data = resp.data.content;
          jobDataInfo.value = data
          jobList.value = [];
          for (const key in jobDataInfo.value) {
            if (data.hasOwnProperty(key)) {
              const value = jobDataInfo.value[key];
              console.log(`Key: ${key}, Value: ${value}`);
              // 在这里可以对每个键值对进行相应的操作
              let option = {
                label: "",
                value: ""
              };
              option.label = value;
              option.value = key;
              jobList.value.push(option);
            }
          }
          console.log("jobList::", jobList.value);
        } else {
          notification.error({ description: data.message });
        }
      });
    };

    const handleChange = value => {
      console.log(`selected ${value}`);
      job.value.description = jobDataInfo.value[value]
    };
    onMounted(() => {
      console.log("index mounted!");
      handleQuery();
    });

    return {
      columns,
      jobs,
      loading,
      handleQuery,
      jobList,
      jobDataInfo,

      handleAdd,
      handleEdit,
      handleDelete,
      handleResume,
      handlePause,
      job,
      modalVisible,
      modalLoading,
      handleModalOk,
      getEnumValue,
      handleRun,
      getJobInfo,
      handleChange
    };
  }
});
</script>

<style scoped>
</style>
