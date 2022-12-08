<template>
  <div>
    
      <el-row>
        <el-col :span="3">
          <el-aside class="tt-aside--wrap">
            <BaseAside />
          </el-aside>
        </el-col>

        <el-col :span="21">
          <el-container>
            <el-header class="tt-header--wrap">
              <BaseHeader />
            </el-header>

            <el-main class="tt-main">
              <router-view></router-view>
            </el-main>
          </el-container>
        </el-col>
      </el-row>
    
  </div>
</template>

<script>
import BaseAside from "@/components/base/BaseAide";
import BaseHeader from "@/components/base/BaseHeader";
export default {
  name: "TtLayOut",
  components: { BaseAside, BaseHeader },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus">

.tt-aside--wrap {
  width: 100% !important
}

.tt-header--wrap {
  height: 70px !important;
  padding: 10px 20px 10px;
  box-shadow: 10px 10px 10px #221e1e;
}

.tt-main {
    width: 100% !important
  height: calc(100vh - 70px);
  box-sizing: border-box;
  background-color: #EFEFEF;
  padding: 10px 20px 10px;
}
</style>