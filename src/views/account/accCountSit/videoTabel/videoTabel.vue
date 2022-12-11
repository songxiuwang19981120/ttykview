<template>
  <div>
    <el-dialog :visible="shwoVideoTabel" :before-close="handlerClose">
      <table-custom
        :mutiSelect="true"
        @handleSelectionChange="handleSelectChange"
        :loading="loading"
        :tableData="videoList"
        :columns="columns"
      ></table-custom>
          <el-dialog
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/myComponent/table/pagination";
import tableCustom from "@/components/myComponent/table/tableCustom";
export default {
  name: "TtprojectVideoTabel",
  components: { Pagination, tableCustom },
  props: {
    shwoVideoTabel: {
      type: Boolean,
    },
    videoList:{
        type:Array
    },
  },
  data() {
    return {
      loading: false,
      videoInfoList: [],
      columns:[
        {
          prop: "member_id",
          label: "用户",
          align: "center",
          fixed: true,
        },
        {
          prop: "aweme_id",
          label: "视频ID",
          align: "center",
        },
        {
          prop: "video_url",
          label: "视频",
          align: "center",
          render:(h,{row})=>{
            return (
                <video width="80px" height="90px" src={row.video_url}></video>
            )
          }
        },
        {
          prop: "video_desc",
          label: "视频描述",
          align: "center",
          width: "200px",
          render:(h,{row})=>{
            return (
                <p width="200px" style="overflow: hidden">{row.video_desc}</p>
            )
          }
        },
        {
          prop: "comment_count",
          label: "评论数量",
          align: "center",
        },
        {
          prop: "digg_count",
          label: "点赞数量",
          align: "center",
        },
        {
          prop: "share_count",
          label: "分享数量",
          align: "center",
        },
        {
          prop: "play_count",
          label: "播放数量",
          align: "center",
        },
        {
          prop: "operation",
          label: "操作",
          width: "150",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  size="mini"
                  onClick={this.handleEdit.bind(this, row)}
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  onClick={this.handleDelete.bind(this, row)}
                >
                  删除
                </el-button>
              </div>
            );
          },
        },

      ]
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeVideoTabel");
    },

    handleSelectChange() {},
  },
};
</script>

<style lang="stylus" scoped></style>