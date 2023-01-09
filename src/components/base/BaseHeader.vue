<template>
  <div class="tt-header">
    <span class="tt-header--title">海王管理系统</span>
    <div class="tt-header--admin">
      管理员：admin
      <el-button type="info" round size="mini" @click="loginOut">退出</el-button>
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
    // 退出
    loginOut() {
      this.$notify.success({
        title: '退出成功',
        message: `再见，尊敬的admin`,
        position: 'top-left'
      })
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss" scoped>

.tt-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tt-header--title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.tt-header--admin {
  cursor: pointer;
}

::v-deep .el-button{
  background-color: #fff !important;
  color: black;
}
</style>