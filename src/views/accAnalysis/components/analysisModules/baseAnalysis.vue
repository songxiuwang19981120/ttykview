<template>
  <div>
    <el-card class="border-ra-20 pad-30">
      <BaseData :icon="icon" :data="summaryData" :title="summaryTitle" />
      <BaseData :icon="icon" :data="liveRoomData" :title="liveRoomTitle" />
      <BaseData
        :icon="icon"
        :data="commerceVideoData"
        :title="commerceVideoTitle"
      />
      <TabData :icon="icon" :data="videoSummaryData" :title="videoSummary" />
      <GraphicalData
        :title="VideoTrendTitle"
        :icon="icon"
        :tabData="VideoTrendData"
        :chartData="VideoTrendChartData"
        :xAxis="xAxis"
        :query="VideoQuery"
        :tabQueryWid="300"
        @setQuery="setVideoQuery($event)"
        :chartId="videoEchart"
      />
      <GraphicalData
        :title="fansTrendTitle"
        :icon="icon"
        :tabData="fansTrendData"
        :chartData="fansTrendChartData"
        :xAxis="xAxis"
        :query="fansQuery"
        :tabQueryWid="100"
        @setQuery="setFansQuery($event)"
        :chartId="fansEchart"
      />
      <div>
        <div class="mar-bot-10">
          <i :class="[icon]" class="color-rad"></i>
          <span class="fz-20">常用话题</span>
        </div>
        <Wordcloud
          ref="wordClound"
          chartId="wordClound"
          height="392px"
          width="100%"
        />
      </div>
      <div>
        <div class="mar-bot-10">
          <i :class="[icon]" class="color-rad"></i>
          <span class="fz-20">粉丝画像</span>
        </div>
        <div class="fans-detail">
          <div>
            <p class="p-title">性别</p>
            <PieEcharts ref="pie" chartId="pie" height="392px" width="390px" />
          </div>
          <div>
            <p class="p-title">粉丝国家</p>
            <Wordcloud
              ref="fansCountry"
              chartId="fansCountry"
              height="392px"
              width="600px"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import BaseData from "./baseAnalysisCom/baseDataCom";
import TabData from "./baseAnalysisCom/tabDataCom";
import Wordcloud from "@/components/myComponent/echarts/wordcloud";
import GraphicalData from "./baseAnalysisCom/graphicalDataCom";
import PieEcharts from "@/components/myComponent/echarts/pie";
export default {
  name: "TtprojectBaseAnalysis",
  components: { BaseData, TabData, Wordcloud, GraphicalData, PieEcharts },
  data() {
    return {
      videoEchart: "videoEchart",
      fansEchart: "fansEchart",
      VideoQuery: "播放量",
      fansQuery: "总量",
      VideoTrendData: ["播放量", "点赞量", "评论量", "转发量"],
      fansTrendData: ["总量", "增量"],
      summaryTitle: "数据概述",
      liveRoomTitle: "直播间数据",
      commerceVideoTitle: "带货视频数据",
      videoSummary: "视频概述",
      icon: "el-icon-s-flag",
      VideoTrendTitle: "视频数据趋势",
      fansTrendTitle: "粉丝变化趋势",
      VideoTrendChartData: [
        {
          data: [1000, 2500, 2000, 3000, 5000, 2000, 2500],
          name: "播放量",
          type: "line",
          smooth: true,
          itemStyle: {
            normal: {
              color: "#DB8067", //改变折线点的颜色
              lineStyle: {
                color: "#DB8067", //改变折线颜色
              },
            },
          },
        },
      ],
      fansTrendChartData: [
        {
          data: [1000, 2500, 2000, 3000, 5000, 2000, 2500],
          name: "总量",
          type: "line",
          smooth: true,
          itemStyle: {
            normal: {
              color: "#DB8067", //改变折线点的颜色
              lineStyle: {
                color: "#DB8067", //改变折线颜色
              },
            },
          },
        },
      ],
      xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      summaryData: [
        {
          lable: "总粉丝数量",
          data: "61.8K",
        },
        {
          lable: "总视频数量",
          data: "200",
        },
        {
          lable: "总点赞数量",
          data: "12K",
        },
        {
          lable: "总评论数量",
          data: "6.8K",
        },
        {
          lable: "粉赞比",
          data: "0.5：1",
        },
      ],
      liveRoomData: [
        {
          lable: "直播次数",
          data: "233",
        },
        {
          lable: "总直播时长",
          data: "233h",
        },
        {
          lable: "平均直播时长",
          data: "2.3h",
        },
        {
          lable: "平均观看数量",
          data: "12k",
        },
        {
          lable: "直播平均点赞数量",
          data: "2.5k",
        },
        {
          lable: "直播平均评论数量",
          data: "103",
        },
      ],
      commerceVideoData: [
        {
          lable: "带货视频数",
          data: "45",
        },
        {
          lable: "平均播放量",
          data: "245K",
        },
        {
          lable: "平均点赞量",
          data: "4K",
        },
        {
          lable: "平均评论量",
          data: "546K",
        },
      ],
      videoSummaryData: [
        {
          lable: "发布视频",
          data: "121",
          tag_lable: "带货视频占比",
          tag_data: "12%",
        },
        {
          lable: "平均点赞数",
          data: "221",
          tag_lable: "最高点赞数",
          tag_data: "231",
        },
        {
          lable: "视频平均时长",
          data: "121",
          tag_lable: "发布视频率",
          tag_data: "10%",
        },
        {
          lable: "平均播放量",
          data: "4K",
          tag_lable: "最高播放量",
          tag_data: "2k",
        },
      ],
      wordCloudData: [
        {
          name: "aaaaaaa",
          value: 122,
        },
        {
          name: "bbbbbb",
          value: 123,
        },
        {
          name: "cccccc",
          value: 124,
        },
        {
          name: "ddddddd",
          value: 45,
        },
        {
          name: "eeeeee",
          value: 97,
        },
        {
          name: "ffffff",
          value: 98,
        },
        {
          name: "gggggg",
          value: 67,
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
      fansCountryData: [
        {
          name: "aaaaaaa",
          value: 122,
        },
        {
          name: "bbbbbb",
          value: 123,
        },
        {
          name: "cccccc",
          value: 124,
        },
        {
          name: "ddddddd",
          value: 45,
        },
        {
          name: "eeeeee",
          value: 97,
        },
        {
          name: "ffffff",
          value: 98,
        },
        {
          name: "gggggg",
          value: 67,
        },
      ],
    };
  },

  mounted() {
    this.initWords();
    this.initPieEchart();
    this.initFansCountry();
  },

  methods: {
    initWords() {
      let chartData = this.wordCloudData;
      this.$refs.wordClound.getIint(chartData);
    },
    initFansCountry() {
      let chartData = this.fansCountryData;
      this.$refs.fansCountry.getIint(chartData);
    },
    initPieEchart() {
      let chartData = this.pieEchartData;
      this.$refs.pie.getIint(chartData);
    },

    setVideoQuery(index) {
      this.VideoQuery = this.VideoTrendData[index];
      this.VideoTrendChartData[0].name = this.VideoTrendData[index];
    },
    setFansQuery(index) {
      this.fansQuery = this.fansTrendData[index];
      this.fansTrendChartData[0].name = this.fansTrendData[index];
    },
  },
};
</script>

<style lang="stylus" scoped>
.dis-flex {
  display: flex;
}

.mar-bot-10 {
  margin-bottom: 20px;
}

.border-ra-20 {
  border-radius: 20px;
}

.pad-30
  padding: 0 30px;

.fz-20
  font-size 20px

.p-title {
  font-size 16px
  font-weight: 700
}

.color-rad {
  color: red;
  margin-right: 10px;
}

.fans-detail {
  display: flex;
  justify-content: space-between;
}
</style>