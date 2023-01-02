<template>
  <div>
    <el-card class="pad-50-80">
      <div class="data-desc">
        <div class="mar-bot-10">
          <i :class="[icon]" class="color-rad"></i>
          <span class="fz-20">视频概述</span>
        </div>
        <el-date-picker
          class="date-picker"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleChange"
        >
        </el-date-picker>
      </div>

      <div class="data-top">
        <div class="data-item">
          <p>20/123</p>
          <p>带货视频/视频</p>
        </div>
        <div class="data-item">
          <p>243</p>
          <p>平均点赞数</p>
        </div>
        <div class="data-item">
          <p>12k</p>
          <p>平均评论数</p>
        </div>
        <div class="data-item">
          <p>4K</p>
          <p>平均分享数</p>
        </div>
      </div>

      <div class="data-bot">
        <div class="data-item">
          <p>2K/15K</p>
          <p>最少点赞/最多点赞</p>
        </div>
        <div class="data-item">
          <p>2K/125K</p>
          <p>最少评论/最多评论</p>
        </div>
        <div class="data-item">
          <p>2K/15K</p>
          <p>最少分享/最多分享</p>
        </div>
      </div>

      <div class="data-mid dis-flex">
        <div>
          <div class="dis-flex">
            <div class="mar-bot-10">
              <i :class="[icon]" class="color-rad"></i>
              <span class="fz-20">作品发布时间</span>
            </div>
            <TabTime :btnData="tabTimeData" @choosedur="chooseFansDur" />
          </div>
        </div>

        <div>
          <div class="mar-bot-10">
            <i :class="[icon]" class="color-rad"></i>
            <span class="fz-20">视频时长分布</span>
          </div>
          <PieEcharts ref="pie" chartId="pie" height="392px" width="390px" />
        </div>
      </div>

      <div class="mar-bot-10">
        <i :class="[icon]" class="color-rad"></i>
        <span class="fz-20">视频列表</span>
      </div>
      <div class="flex-space-between  mar-bot-10 pad-80">
        <p class="fw-bold fz-16 font-source">共
          <span class="color-BD4F6C">{{ videoCount }}</span>
          条视频
        </p>
        <div>
          <el-select class="video-select" style="width: 94px" v-model="searchForm.query" placeholder="请选择">
            <el-option
              v-for="item in queryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select class="mr-36 video-select" style="width: 94px" v-model="searchForm.sort" placeholder="请选择">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button size="mini">确定</el-button>
        </div>
      </div>
      <TableCustom
        :loading="loading"
        :tableData="videoList"
        :columns="columns"
        class="table-custom"
      />
      <Pagination
        :total="videoCount"
        :page="page"
        :limit="limit"
        @pagination="handlePagination"
      />
      <VideoDetail 
      :showVideoDetail="showVideoDetail"
      :videoInfo="videoDetailInfo"
      />
    </el-card>
  </div>
</template>

<script>
import TabData from "./baseAnalysisCom/tabDataCom";
import Pagination from "@/components/myComponent/table/pagination";
import TableCustom from "@/components/myComponent/table/tableCustom";
import PieEcharts from "@/components/myComponent/echarts/pie";
import Echarts from "@/components/myComponent/echarts/axis";
import TabTime from "@/components/index/chooseduration";
import VideoDetail from './videoAnalysis/videoDetail'
export default {
  name: "TtprojectVideoAnalysis",
  components: {
    TabData,
    Pagination,
    TableCustom,
    PieEcharts,
    Echarts,
    TabTime,
    VideoDetail
  },
  data() {
    return {
      date: "",
      loading: false,
      member_id: "",
      icon: "el-icon-s-flag",
      showVideoDetail:false,
      videoDetailInfo:{},
      searchForm: {
        query: "",
        sort: "",
      },
      tabTimeData: ["日", "周"],
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
            text: "最近半个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
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
      videoAnalysisData: [
        {
          lable: "带货视频/视频",
          data: "20/233",
        },
        {
          lable: "平均点赞数",
          data: "233",
        },
        {
          lable: "平均评论数",
          data: "333",
        },
        {
          lable: "平均分享数",
          data: "3K",
        },
        {
          lable: "平均分享数",
          data: "3K",
        },
      ],
      queryOptions: [
        { label: "播放量", value: "play_num" },
        { label: "播放量", value: "2" },
        { label: "播放量", value: "3" },
        { label: "播放量", value: "4" },
        { label: "播放量", value: "5" },
      ],
      sortOptions: [
        { label: "升序", value: 1 },
        { label: "降序", value: 0 },
      ],
      columns: [
        {
          prop: "video_url",
          label: "视频",
          align: "center",
          width: "200",
          render: (h, { row }) => {
            return (
              <div style="display:flex;align-items: center;">
                <el-image
                  style="width: 70px ; height: 70px ; border-radius: 50%;margin-right: 10px"
                  src={row.video_pic_url}
                ></el-image>
                <div>
                  <el-tooltip content={row.video_desc} placement="top">
                    <p>{row.video_desc.substring(0, 10) + "..."}</p>
                  </el-tooltip>
                  <span>
                    <i class="el-icon-time"></i> {row.addtime}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          prop: "play_count",
          label: "播放量",
          align: "center",
        },
        {
          prop: "digg_count",
          label: "点赞量",
          align: "center",
        },
        {
          prop: "comment_count",
          label: "评论量",
          align: "center",
        },
        {
          prop: "share_count",
          label: "转发量",
          align: "center",
        },
        {
          prop: "share_count",
          label: "分享量",
          align: "center",
        },

        {
          prop: "operation",
          label: "操作",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  size="mini"
                  onClick={this.showDetail.bind(this, row)}
                >
                  详情
                </el-button>
              </div>
            );
          },
        },
      ],
      pieEchartData: [
        {
          name: "女性",
          value: 30,
        },
        {
          name: "男性",
          value: 15,
        },
        {
          name: "未知",
          value: 10,
        },
      ],
      videoList: [],
      videoCount: 0,
      page: 1,
      limit: 10,
    };
  },

  mounted() {
    this.initPage();
    this.initPieEchart();
  },

  methods: {
    showDetail(row) {
      this.videoDetailInfo = row
      this.showVideoDetail = true
    },
    closeDetail(){
      this.showVideoDetail = false
    },
    chooseFansDur(index) {
      console.log(index);
    },
    initPieEchart() {
      let chartData = this.pieEchartData;
      this.$refs.pie.getIint(chartData);
    },
    initPage() {
      let userInfo = JSON.parse(this.$route.query.userInfo);
      this.member_id = userInfo.member_id;
      this.getVideoList();
    },
    /* 
        function: shwoVideoTabel
        params: null
        desc: 获取视频数据
    */
    async getVideoList() {
      try {
        this.loading = true;
        let data = {
          member_id: this.member_id,
          page: this.page,
          limit: this.limit,
        };
        let result = await this.$api({ type: "getMemberList", data: data });
        this.videoList = result.data.list ?? [];
        this.videoCount = result.data.count ?? 0;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    handleChange() {},
    handlePagination() {},
  },
};
</script>

<style lang="stylus" scoped>
.table-custom {
  border: 1px solid #ccc;
  border-radius: 30px;
}

.color-BD4F6C
  color #BD4F6C

.color-rad {
  color: red;
  margin-right: 10px;
}

.mar-bot-10
  margin-bottom 10px

.mr-36
  margin-right: 36px

.pad-50-80 {
  padding: 50px 80px;
}

.fw-bold
  font-weight: bold

.font-source
  font-family: SourceHanSansSC-regular;

.pad-80
  padding 0 110px

.fz-16 {
  font-size: 16px;
}

.fz-20 {
  font-size: 20px;
}

.dis-flex {
  display: flex;
}

.flex-space-between
  display: flex
  justify-content: space-between

.data-desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
}

.data-item {
  width: 150px;
  height: 50px;
  text-align: center;

  p:nth-of-type(1) {
    font-weight: 700;
  }

  p:nth-of-type(1) {
    font-size: 20px;
  }

  p:nth-of-type(2) {
    font-size: 14px;
  }
}

.data-top {
  display: flex;
  justify-content: space-between;
  padding: 30px 80px;
}

.data-mid {
  justify-content: space-between;
}

.data-bot {
  display: flex;
  justify-content: space-between;
  padding: 30px 140px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}

/* hark */
::v-deep .video-select .el-input__inner {
  height: 28px;
  background-color: #ccc;
}

::v-deep .video-select .el-input__icon {
  line-height: 0;
}

::v-deep .video-select .el-select__caret::before {
  color: rgba(65, 80, 88, 1);
}

::v-deep .el-input__inner::-webkit-input-placeholder {
  color: rgba(65, 80, 88, 1);
  font-size: 14px;
}
</style>