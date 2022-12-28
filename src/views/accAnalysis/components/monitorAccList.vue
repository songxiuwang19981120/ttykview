<template>
  <div>
    <el-card class="monitor-wrap">
      <div class="monitor-screen">
        <el-select style="width: 140px" v-model="query" placeholder="请选择">
          <el-option
            v-for="item in queryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select style="width: 140px" v-model="sort" placeholder="请选择">
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "TtprojectMonitorAccList",

  data() {
    return {
      queryOptions: [{ value: "播放量", label: "播放量" }],
      sortOption: [
        { value: 1, label: "升序" },
        { value: 0, label: "降序" },
      ],
      query: "",
      sort: "",
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus" scoped>
.monitor-wrap {
  width: 530px;
  height: 500px;
  border-radius: 33px;
}

.monitor-screen {
  display: flex;
  align-items: center;
  padding-left: 60px
  margin: 0 auto;
  width: 500px;
  height: 50px;
  background-color: #EFEFEF;
  border-radius: 26px;
}
</style>