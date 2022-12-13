<template>
  <div>
    <el-dialog :visible="shwoVideoTabel" :before-close="handlerClose">
      <table-custom
        @handleSelectionChange="handleSelectChange"
        :loading="loading"
        :tableData="videoList"
        :columns="columns"
      ></table-custom>
      <el-dialog
        width="40%"
        title="播放视频"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="video-window">
            <video autoplay width="40%" :src="videoSrc" controls="controls"></video>
        </div>
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
    videoList: {
      type: Array,
    },
  },
  data() {
    return {
      innerVisible: false,
      videoSrc:'',
      loading: false,
      videoInfoList: [],
      columns: [
 
        {
          prop: "video_url",
          label: "视频",
          align: "center",
          render: (h, { row }) => {
            return (
              <video style="cursor:pointer"  onClick={this.handlerPlayer.bind(this, row)} width="80px" height="70px" src={row.video_url}></video>
            );
          },
        },
        {
          prop: "video_desc",
          label: "视频描述",
          align: "center",
          width: "200px",
          render: (h, { row }) => {
            return (
              <p width="200px" style="overflow: hidden">
                {row.video_desc}
              </p>
            );
          },
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
                  onClick={this.handlerPlayer.bind(this, row)}
                >
                  播放
                </el-button>
              </div>
            );
          },
        },
      ],
    };
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeVideoTabel");
    },
    handlerPlayer(row) {
      this.innerVisible = true;
      this.videoSrc = row.video_url

      console.log(row);
    },
    handleSelectChange() {},
  },
};
</script>

<style lang="stylus">
.video-window
    display: flex
    align-items: center
    justify-content: space-around
</style>