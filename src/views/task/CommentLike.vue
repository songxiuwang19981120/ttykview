<template>
  <div>
    <div class="tt-accsituation">
      <div class="tt-accsituation--operation">
        <div style="margin-right: 20px">
          <el-select v-model="page.status" placeholder="请选择任务状态" size="medium">
            <el-option v-for="item in searchStateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker size="medium" class="date-picker" v-model="date" type="daterange" align="right" unlink-panels
            range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button size="medium" type="primary" class="seachbut" :loading="btnloading" @click="searchTasks">{{
    btnloading ? "加载中..." : "搜索"
}}</el-button>
        <el-button type="primary" size="medium" class="seachbut" @click="btnReset">重置</el-button>
        <el-button type="primary" size="medium" class="seachbut" @click="showLikeCommentDialog">点赞任务</el-button>
        <!-- <i class="el-icon-refresh-left"></i> -->
      </div>
    </div>
    <!-- 表格 -->
    <table-custom :loading="loading" :tableData="tableData" :columns="columns" height="700"></table-custom>
    <!-- 分页 -->
    <pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
    <!-- 弹层 -->
    <commentLikeDetail ref="taskDialog" @closeTaskDetail="closeTaskDetail" :showTaskDetail="showTaskDetail" :tableData="tableData"></commentLikeDetail>
    <newCommentLike ref="likecommment" @closeLikeCommentTask="closeLikeCommentTask" :showLikeCommentTask="showLikeCommentTask" />
  </div>
</template>
<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import commentLikeDetail from "./component/commentLikeDetail.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
import newCommentLike from "./component/newCommentLike.vue";
export default {
  name: "TtCommentLike",
  components: {
    tableCustom,
    pagination,
    commentLikeDetail,
    newCommentLike,
  },
  data() {
    return {
      date: '',
      showTaskDetail: false,
      showLikeCommentTask: false,
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
                  type="success"
                  size="mini"
                  onClick={this.toDetail.bind(this, row.tasklist_id)}
                >
                  查看详情
                </el-button>
                <el-button
                  type="warning"
                  size="mini"
                  onClick={this.suspend.bind(this, row.tasklist_id)}
                  style="margin-right:10px"
                >
                  暂停
                </el-button>
                <el-popconfirm
                  confirm-button-text="删除"
                  cancel-button-text="取消"
                  title="确认删除该任务吗？"
                  onConfirm={this.delete.bind(this, row.subjectcontent_id)}
                >
                  <el-button slot="reference" type="danger" size="mini">
                    删除
                  </el-button>
                </el-popconfirm>
              </div>
            );
          },
        },
      ],
      dialog: false, // 弹层
      page: {
        page: 1,
        limit: 10,
        task_type: "CommentDigg",
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
  },

  mounted() {
    this.getVideoTasks(this.page);
  },

  methods: {
    delete(id) {
      this.$message.success('删除成功');

    },
    // 暂停
    suspend(id) {
      this.$message.success('操作成功');
    },
    // 隐藏评论点赞任务详情
    closeTaskDetail() {
      this.showTaskDetail = false
    },
    // 获取评论区点赞任务列表
    async getVideoTasks(data) {
      try {
        this.loading = true;
        const res = await this.$api({
          type: "getTasklist",
          data,
        });
        console.log(res, "评论区点赞数据");
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
      this.showTaskDetail = true;
      this.$refs.taskDialog.getTaskListDetail(id);
    },
    // 当前页数据条数/页码改变
    pageChange(obj) {
      this.page.page = obj.page
      this.page.limit = obj.limit;
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
        task_type: "CommentDigg",
        status: "",
      };
      this.getVideoTasks(this.page);
    },
    /* 
        function: closeLikeCommentTask
        params: null
        desc: 关闭评论点赞配置窗口
    */
    closeLikeCommentTask() {
      this.showLikeCommentTask = false;
    },

    /* 
        function: showLikeCommentDialog
        params: null
        desc: 展示评论点赞配置窗口
    */
    showLikeCommentDialog() {
      this.showLikeCommentTask = true;
      this.$refs.likecommment.getList()
    },
  },
};
</script>

<style  lang="scss" scoped>
@import '@/assets/base/_color_variables.scss';

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
