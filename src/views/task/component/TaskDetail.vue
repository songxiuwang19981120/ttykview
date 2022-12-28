<template>
  <div>
    <el-dialog
    :visible="showTaskDetail"
    :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">{{ title || "默认标题" }}</h1>
      </span>
      <table-custom
        :loading="loading"
        :tableData="tableData"
        :columns="columns"
      >
      </table-custom>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
export default {
  name: "TtprojectTaskDetail",
  props: {
    title: {
      type: String,
    },
    tableData: {
      type: Array,
    },
    taskDesc: {
      type: String,
    },
    showTaskDetail:{
        type: Boolean
        
    }
  },
  components: {
    tableCustom,
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          prop: "avatar_thumb",
          label: "头像",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-image
                  src={row.avatar_thumb}
                  style="width: 60px; height: 60px"
                ></el-image>
                <div>
                  <h1></h1>
                  <span>ID:</span>
                </div>
              </div>
            );
          },
        },
        ,
        {
          prop: "typecontrol_id",
          label: "账号分类",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>巴西/盲盒/美女/丝袜</span>
              </div>
            );
          },
        },
        {
          prop: "task_num",
          label: "任务批次",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>23</span>
              </div>
            );
          },
        },
        {
          prop: "curr_num",
          label: { taskDesc },
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>999</span>
              </div>
            );
          },
        },
        {
          prop: "lose_num",
          label: "失败次数",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>1</span>
              </div>
            );
          },
        },
        {
          prop: "update_time",
          label: "更新时间",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>2022-12-13 21:25:27</span>
              </div>
            );
          },
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <span>完成</span>
              </div>
            );
          },
        },
        {
          prop: "status",
          label: "状态",
          width: "100",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button>日志</el-button>
                <el-button>删除</el-button>
              </div>
            );
          },
        },
      ],
    };
  },

  mounted() {},

  methods: {
    handlerClose(){
        this.$emit('closeTaskDetail')
    }
  },
};
</script>

<style lang="stylus" scoped></style>