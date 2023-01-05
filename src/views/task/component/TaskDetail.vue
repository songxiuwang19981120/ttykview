<template>
  <div>
    <el-dialog width="70%" :visible="showTaskDetail" :before-close="handlerClose" title="评论点赞任务详情">
      <table-custom :loading="loading" :tableData="tableData" :columns="columns" height="700"></table-custom>
      <pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
      <span slot="footer">
        <el-button @click="handlerClose" size="medium">取 消</el-button>
      </span>
      <el-dialog width="55%" :visible="showJournal" :before-close="journalClose" title="评论点赞任务日志"  append-to-body>
            <table-custom
            :loading="journalLoading"
            :tableData="journaltableData"
            :columns="journalColumns"
            height="700"
            ></table-custom>
        </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
export default {
  name: "TtprojectTaskDetail",
  props: {
    showTaskDetail: {
      type: Boolean
    }
  },
  components: {
    tableCustom,
    pagination,
  },
  data() {
    return {
      journalLoading:false,
      journaltableData:[],
      journalColumns:[
      {
          label: '目标uid',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '视频ID',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '评论内容',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '更新时间',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '耗时',
          prop: 'task_type',
          align: 'center',
        },
        {
          label: '失败原因',
          prop: 'task_type',
          align: 'center',
        },
      ],
      page:1,
      limit:10,
      total:0,
      loading: false,
      showJournal:false,
      tableData: [],
      columns: [
        {
          label: '头像',
          prop: 'task_type',
          align: 'center',
          fixed: true,
          width: '100',
          render(h, { row }) {
            return (
              <div>
                <el-image style="width:50px;height:50px" src={row.img}></el-image>
              </div>
            );
          },
        },
        {
          label: '账号分类',
          prop: 'task_type',
          align: 'center',
          width: '150',
        },
        {
          label: '任务批次',
          prop: 'task_type',
          align: 'center',
          width: '100',
        },
        {
          label: '目标数量',
          prop: 'task_type',
          align: 'center',
          width: '100',
        },
        {
          label: '已执行数量',
          prop: 'task_type',
          align: 'center',
          width: '100',
        },

        {
          label: '失败次数',
          prop: 'task_type',
          align: 'center',
          width: '100',
        },
        {
          label: '更新时间',
          prop: 'create_time',
          align: 'center',
          width: '150',
        },
        {
          label: '状态',
          prop: 'status',
          align: 'center',
          width: '100',
          render(h, { row }) {
            const { status } = row;
            let state;
            if (status == 0) {
              state = '成功';
            } else if (status == 1) {
              state = '未开始';
            } else if (status == 2) {
              state = '失败';
            }
            return <div>{state}</div>;
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
                  onClick={this.journalClick.bind(this, row.id)}
                  style="margin-right:10px"
                >
                  日志
                </el-button>
                <el-popconfirm
                  confirm-button-text="删除"
                  cancel-button-text="取消"
                  title="确认删除该任务吗？"
                  onConfirm={this.deleteClick.bind(this, row.id)}
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
    };
  },

  mounted() { },

  methods: {
    // 日志取消
    journalClose(){
      this.journaltableData=[]
      this.showJournal=false;
    },
    // 日志
    journalClick(id){
      this.showJournal=true
      this.journaltableData=[
        {
          task_type:1 
        }
      ]
    },
    // 删除
    deleteClick(id) {
      this.$message.success('删除成功');
    },
    // 获取数据
    getTaskListDetail(id) {
      console.log(id);
      this.tableData = [
        {
          id:1,
          status: 0,
          img: 'http://192.168.4.30/uploads/uploadfiles/202212/63abccf6d52b5.jpg',
          task_type: '1',
          create_time: '2023 01-03 01:00:00'
        }
      ]

    },
    // 当前页数据条数/页码改变
    pageChange(obj) {
      this.page = obj.page
      this.limit = obj.limit;
      this.getTaskListDetail();
    },
    showLogDialog() {

    },
    handleDel() {
      console.log('删除')
    },
    handlerClose() {
      this.tableData = []
      this.$emit('closeTaskDetail')
    }
  },
};
</script>

<style lang="stylus" scoped></style>