<template>
  <div class="ttproject-wrap">
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
              <router-view ref="view"></router-view>
           
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
  width: 100% !important;
}



.tt-header--wrap {
  z-index: 9
  height: 56px !important;
  padding: 10px 20px 10px;
  box-shadow: 7px 6px 15px #c1c1c9
}

.tt-main {
  padding: 0 10px
  width: 100% !important;

  box-sizing: border-box;

}


/* .el-cascader-panel .el-radio {
  100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 0px;
  right: 10px;
}

.el-cascader-node__label {
  157px;
}

.el-cascader-panel .el-radio__input {
  visibility: hidden;
}

.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
} */

</style>