<template>
  <div>
    <div class="tt-accsituation">
      <div class="tt-accsituation--operation">
        <div style="margin-right: 20px">
          <el-select v-model="page.status" placeholder="请选择任务状态">
            <el-option
              v-for="item in searchStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-date-picker
            class="date-picker"
            v-model="date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <!-- 查询 -->
        <el-button
          type="primary"
          class="seachbut"
          :loading="btnloading"
          @click="searchTasks"
          >{{ btnloading ? "加载中..." : "搜索" }}</el-button
        >
        <el-button type="primary" class="seachbut" @click="btnReset"
          >重置</el-button
        >
        <el-button type="primary" class="seachbut" @click="showFollowTaskDialog"
          >私信任务</el-button
        >
		<i class="el-icon-refresh-left"></i>
      </div>
    </div>
    <!-- 表格 -->
    <table-custom
      :loading="loading"
      :tableData="tableData"
      :columns="columns"
    ></table-custom>
    <!-- 分页 -->
    <pagination
      :total="total"
      :page="page.page"
      :limit="page.limit"
      @pagination="pageChange"
    ></pagination>
    <!-- 弹层 -->
    <PrivateLetterDialogComponent
      ref="dialog"
      :showDialog.sync="dialog"
      :curId="curId"
    >
    </PrivateLetterDialogComponent>
    <LetterTaskDialog
      @closeFollowTask="closeFollowTask"
      :showFollowDialog="showFollowDialog"
    />
    <TaskDetail
      @closeTaskDetail="closeTaskDetail"
      :showTaskDetail="showTaskDetail"
      :taskDesc="title"
      :tableData="tableData"
      :title="title"
    />
  </div>
</template>
<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import PrivateLetterDialogComponent from "./component/PrivateLetterDialogComponent.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
import LetterTaskDialog from "@/views/account/accCountSit/taskDialog/followDialog.vue";
import TaskDetail from "./component/TaskDetail.vue";
export default {
  name: "TtPrivateLetter",
  components: {
    tableCustom,
    PrivateLetterDialogComponent,
    pagination,
    LetterTaskDialog,
    TaskDetail,
  },
  data() {
    return {
		date:'',
      showFollowDialog: false,
      // 下拉选择数据
      searchStateList: [
        {
          value: "0",
          label: "已完成",
        },
        {
          value: "1",
          label: "未完成",
        },
      ],
      loading: false,
      btnloading: false,
      tableData: [],
      columns: [
        {
          prop: "create_time",
          label: "创建时间",
          align: "center",
        },
        {
          prop: "task_name",
          label: "任务名称",
          align: "center",
        },
        {
          prop: "status",
          label: "任务状态",
          align: "center",
          render: (h, { row }) => {
            return <div>{row.status == 0 ? "已完成" : "未完成"}</div>;
          },
        },
        {
          label: "任务进度",
          align: "center",
          render(h, { row }) {
            const { complete_num, fail_num } = row;
            let percent;
            if (Number(complete_num) + Number(fail_num) == 0) {
              percent = "0.00%";
            } else {
              percent =
                (
                  (Number(complete_num) /
                    (Number(complete_num) + Number(fail_num))) *
                  100
                ).toFixed(2) + "%";
            }
            return <div>{percent}</div>;
          },
        },
        {
          label: "操作",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  onClick={this.toDetail.bind(this, row.tasklist_id)}
                >
                  查看详情
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  onClick={this.delete.bind(this, row.tasklist_id)}
                >
                  删除
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  onClick={this.suspend.bind(this, row.tasklist_id)}
                >
                  暂停
                </el-button>
              </div>
            );
          },
        },
      ],
      dialog: false, // 弹层
      page: {
        page: 1,
        limit: 10,
        task_type: "Chat",
        status: "",
      },
      total: 0,
      curId: null,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },

  created() {
    // 获取私信任务列表
    this.getVideoTasks(this.page);
  },

  mounted() {},

  methods: {
    closeTaskDetail() {
      this.showTaskDetail = false;
    },
    delete() {
      console.log("删除");
    },

    suspend() {
      console.log("暂停");
    },
    closeFollowTask() {
      this.showFollowDialog = false;
    },

    showFollowTaskDialog() {
      this.showFollowDialog = true;
    },
    // 获取私信任务列表
    async getVideoTasks(data) {
      try {
        this.loading = true;
        const res = await this.$api({
          type: "getTasklist",
          data,
        });
        console.log(res, "私信列表数据");
        if (res.status == 200) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.btnloading = false;
      }
    },
    // 查看详情
    toDetail(id) {
      this.dialog = true;
      this.curId = id;
      this.$refs.dialog.getTaskListDetail({
        page: 1,
        limit: 10,
        tasklist_id: id,
      });
    },
    // 当前页数据条数/页码改变
    pageChange(obj) {
      (this.page.page = obj.page), (this.page.limit = obj.limit);
      this.getVideoTasks(this.page);
    },
    // 点击查询按钮
    searchTasks() {
      this.btnloading = true;
      this.page.page = 1;
      this.getVideoTasks(this.page);
    },
    // 点击重置按钮
    btnReset() {
      this.page = {
        page: 1,
        limit: 10,
        task_type: "Chat",
        status: "",
      };
      this.getVideoTasks(this.page);
    },
  },
};
</script>
<style  lang="scss" scoped>

.date-picker {
	margin-left: 16px;
}

.el-icon-refresh-left {
	margin: 5px 0 0 50px;
	font-size: 30px;
	color: $button-back-color;
	cursor: pointer;
}
</style>
