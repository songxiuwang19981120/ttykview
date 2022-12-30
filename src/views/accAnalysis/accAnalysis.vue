<template>
  <div>
    <el-container class="accAnalysis-wrap">
      <el-row class="accAnalysis-content">
        <el-col :span="7">
          <UserCard :userInfo="userInfo" />
          <MonitorAccList />
        </el-col>
        <el-col :span="17">
          <el-container>
            <el-header>
              <div class="accAnalysis-tab">
                <p class="tab-btn" @click="getText($event)">基础分析</p>
                <p class="tab-btn" @click="getText($event)">视频分析</p>
                <p class="tab-btn" @click="getText($event)">直播分析</p>
              </div>
            </el-header>
            <el-main>
              <component :is="analysisModule"></component>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import UserCard from "./components/userCard";
import MonitorAccList from "./components/monitorAccList";
import BaseModule from "./components/analysisModules/baseAnalysis";
import VideoModule from "./components/analysisModules/videoAnalysis";
import LiveModule from "./components/analysisModules/liveAnalysis";
export default {
  name: "TtprojectAccAnalysis",
  components: {
    UserCard,
    MonitorAccList,
    BaseModule,
    VideoModule,
    LiveModule,
  },
  data() {
    return {
      text: "",
      moduleStatusMap: {
        '基础分析': "BaseModule",
        '视频分析': "VideoModule",
        '直播分析': "LiveModule",
      },
      userInfo: {},
    };
  },
  computed: {
    analysisModule() {
      let val = this.text || "基础分析";
      return this.moduleStatusMap[val];
    },
  },
  mounted() {
    this.userInfo = JSON.parse(this.$route.query.userInfo);
    console.log(this.userInfo);
  },

  methods: {
    getText(e) {
      console.log(111, e);
      this.text = e.path[0].innerText;
      console.log(this.text);
    },
  },
};
</script>

<style lang="stylus" scoped>
.accAnalysis-wrap {
  padding: 20px 20px 0 30px;
  width: 100vw;
}

.accAnalysis-content {
  width: 100vw;
  height: 100%;
}

.accAnalysis-left {
  width: 100%;
}

.tab-btn 
  width: 120px
  height: 40px
  font-size 18px
  background-color: #EFEFEF
  text-align: center
  line-height 40px
  border-radius: 18px
  font-weight: 700
  cursor pointer
  &:hover
    box-shadow: 0 2px 8px 0 #ccc;
    transition: .4s

.accAnalysis-tab {
  display: flex
  justify-content: space-around
  align-items: center
  padding: 0 180px
  width: 100%
  height: 70px
  background-color #fff
  box-shadow: 0 2px 8px 0 #ccc;
  border-radius: 18px
}
</style>