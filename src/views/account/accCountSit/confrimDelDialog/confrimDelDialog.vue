<template>
  <div>
    <el-dialog
      width="20%"
      :visible="showConfrimDel"
      :before-close="handlerClose"
    >
      <span slot="title">
        <h1 class="tt-acccountsit--title">删除账号</h1>
      </span>
      <p class="deldialog-desc">此操作不可逆，确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectConfrimDelDialog",
    props:{
        showConfrimDel:{
            type:Boolean
        }
    },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    handlerConfrim(){
        this.$emit('handleConfrim')
    },
    handlerClose(){
        this.$emit('handleClose')
    }
  },
};
</script>

<style lang="stylus" scoped>
.deldialog-desc
    font-size 20px
</style>