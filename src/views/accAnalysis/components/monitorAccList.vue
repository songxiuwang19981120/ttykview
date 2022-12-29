<template>
  <div>
    <el-card class="monitor-wrap">
      <div class="monitor-screen">
        <el-select
          style="width: 140px"
          v-model="query"
          placeholder="请选择字段"
        >
          <el-option
            v-for="item in queryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          style="width: 140px"
          v-model="sort"
          placeholder="请选择排序方式"
        >
          <el-option
            v-for="item in sortOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-button>确定</el-button>
      </div>

      <happy-scroll class="scroll">
        <table-custom
          :loading="loading"
          :tableData="tableData"
          :columns="columns"
        ></table-custom>
      </happy-scroll>
    </el-card>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
export default {
  name: "TtprojectMonitorAccList",
  components: { tableCustom },
  data() {
    return {
      loading: false,
      queryOptions: [{ value: "播放量", label: "播放量" }],
      sortOption: [
        { value: 1, label: "升序" },
        { value: 0, label: "降序" },
      ],
      query: "",
      sort: "",
      tableData: [
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",

          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",

          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
        {
          avatar: "http://192.168.4.30/uploads/file/7164384802589606918.png",
          nikname: "MAX",
          fans: "2.3K",
          video_num: "300",
          play_num: "100",
          comment_num: "100",
          forward_num: "500",
        },
      ],
      columns: [
        {
          prop: "avatar",
          label: "头像",
          align: "center",
          render: (h, { row }) => {
            return (
              <el-image
                src={row.avatar}
                style="width: 60px; height: 60px; border-radius: 50%;"
              ></el-image>
            );
          },
        },
        {
          prop: "nikname",
          label: "昵称",
          align: "center",
        },
        {
          prop: "fans",
          label: "粉丝量",
          align: "center",
          width: "70",
        },
        {
          prop: "video_num",
          label: "视频量",
          align: "center",
          width: "70",
        },
        {
          prop: "comment_num",
          label: "评论量",
          align: "center",
        },
        {
          prop: "comment_num",
          label: "PK",
          align: "center",
          render: (h, { row }) => {
            return (
              <el-button onClick={this.handlePK.bind(this, row)} size="mini">
                PK
              </el-button>
            );
          },
        },
      ],
    };
  },

  mounted() {},

  methods: {
    handlePK() {
      console.log("PK");
    },
  },
};
</script>

<style lang="stylus" scoped>
.monitor-wrap {
  width: 530px;
  height: 500px;
  border-radius: 33px;
}

.scroll
  height: 400px

.monitor-screen {
  display: flex;
  align-items: center;
  padding-left: 60px;
  margin: 0 auto;
  width: 500px;
  height: 50px;
  background-color: #EFEFEF;
  border-radius: 26px;
}
</style>