<template>
  <div>
    <el-dialog
      width="40%"
      :visible="showVideoDetail"
      :before-close="handlerClose"
    >
      <GraphicalData
        :title="videoDetailTitle"
        :icon="icon"
        :tabData="fansTrendData"
        :chartData="fansTrendChartData"
        :xAxis="xAxis"
        :query="fansQuery"
        :tabQueryWid="100"
        @setQuery="setFansQuery($event)"
        :chartId="fansEchart"
      />
    </el-dialog>
  </div>
</template>

<script>
import GraphicalData from "@/views/accAnalysis/components/analysisModules/baseAnalysisCom/graphicalDataCom";
export default {
  name: "TtprojectVideoDetail",
  components: { GraphicalData },
  data() {
    return {};
  },
  props: {
    videoDetailTitle:{
        type:String
    },
    icon:{
        type:String
    },
    showVideoDetail: {
      type: Boolean,
    },
    videoInfo: {
      type: Object,
    },

    title: {
      type: String,
    },
    tabData:{
      type:Array
    },
    chartData:{
      type:Array
    },
    xAxis:{
      type:Array
    },
    query:{
      type:String
    },
    tabQueryWid:{
      type:Number
    },
    chartId:{
      type:String
    }
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="stylus" scoped></style>