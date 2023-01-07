<template>
  <div class="tt-header">
    <h1>基础信息</h1>
    <div class="tt-header--admin">
      管理员：admin
      <el-dropdown  trigger="click">
        <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus-outline"
            >螺蛳粉</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-check"
            >蚵仔煎</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "TtprojectBaseHeader",

  data() {
    return {};
  },

  mounted() {},

  methods: {

  },
};
</script>

<style lang="stylus">
.tt-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tt-header--admin {
  cursor: pointer;
}
</style>