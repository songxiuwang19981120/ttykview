<template>
  <div>
    <div>
      <div class="data-desc dis-flex mar-bot-20">
        <div>
          <i :class="[icon]" class="color-rad"></i>
          <span class="fz-20">{{ title }}</span>
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
      <TabQuery :curWidth="tabQueryWid" :typeData="tabData" @changeType="setQuery" />
      <InfoBar  class="mar-bot-20" :time="date" :data="infoBarData" />
      <Echarts class="echarts" ref="axis" :chartId="chartId" height="392px" width="100%" />
    </div>
  </div>
</template>

<script>
import TabQuery from "@/components/index/choosetype";
import Echarts from "@/components/myComponent/echarts/axis";
import InfoBar from "./infoBar";
export default {
  name: "TtprojectGraphicalDataCom",
  components: { TabQuery, InfoBar, Echarts },
  props: {
    icon: {
      type: String,
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
  watch:{
    query(){
      this.initEcharts()
    }
  },
  data() {
    return {
      date:'',
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
      infoBarData: {
        max_num: "2223",
        min_num: "324",
        average_num: "423",
        update_time: "2022-12-12 22:23:43",
      },
    };
  },

  mounted() {
    this.initEcharts();
  },

  methods: {
      initEcharts() {
        let data = this.chartData
        let xAxis = this.xAxis
        let legend = [`${this.query}`];
        this.$refs.axis.getIint(data, xAxis, legend);
      },
    handleChange(val){
      console.log(val)
    },
     /* 
        function: setQuery
        params: index | 下标
        desc: 设置字段，用于图标更新
    */
    setQuery(index) {
      this.$emit('setQuery',index)
    },
  },
};
</script>

<style lang="stylus" scoped>
.dis-flex {
  display: flex;
  justify-content: space-between;
}

.border-bot {
  border-bottom: 1px solid #ccc;
}

.color-rad {
  color: red;
  margin-right: 10px;
}

.fz-20
  font-size 20px

.mar-bot-20 {
  margin-bottom: 20px;
}

.border-bot {
  border-bottom: 1px solid #ccc;
}

.data-item {
  width: 150px;
  height: 50px;
  text-align: center;

  p:nth-of-type(1) {
    font-weight: 700;
  }
}

.echarts
  margin: 0 auto
</style>