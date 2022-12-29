<template>
  <div>
    <div>
      <div class="data-desc dis-flex mar-bot-10">
        <div>
          <i :class="[icon]" class="color-rad"></i>
          <span class="title">{{ title }}</span>
        </div>
        <el-date-picker
          class="date-picker"
          v-model="date"
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

      <TabQuery 
      :curWidth="300"
      :typeData="typeData"
      />
      <InfoBar 
      :time="date"
      :data="infoBarData"/>

    </div>
  </div>
</template>

<script>
import TabQuery from '@/components/index/choosetype'
import InfoBar from './infoBar'
export default {
  name: "TtprojectGraphicalDataCom",
    components:{TabQuery,InfoBar},
    props:{
        icon:{
            type:String
        },
        title:{
            type:String
        }
    },
  data() {
    return {
        typeData:['播放量','点赞量','评论量','转发量'],
            
        
        infoBarData:{
            max_num:'2223',
            min_num:'324',
            average_num:'423',
            update_time:'2022-12-12 22:23:43'
        }
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus" scoped>
.dis-flex {
  display: flex;
  justify-content: space-between
}

.border-bot
  border-bottom: 1px solid #ccc

.color-rad {
  color: red
  margin-right: 10px
}

.pad-20
  padding: 0 70px

.mar-bot-10
  margin-bottom: 20px

.border-bot
  border-bottom: 1px solid #ccc

.data-item
  width: 150px
  height: 50px
  text-align: center

  p
    font-weight 700
</style>