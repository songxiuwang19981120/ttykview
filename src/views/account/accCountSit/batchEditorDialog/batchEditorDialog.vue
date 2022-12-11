<template>
  <div>
    <el-dialog :visible="showBatchEiDialog" :before-close="handlerClose">
      <span slot="title">
        <h1 class="tt-acccountsit--title">批量编辑</h1>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TtprojectBatchEditorDialog",
    props:{
      showBatchEiDialog:{
        type:Boolean
      },
      check_all:{
        type:Boolean
      }
        
    },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    handlerClose(){
        this.$emit('closeBatchEidialog')
    },
    handlerConfrim(){
        console.log('确认')
    }
  },
};
</script>

<style lang="stylus" scoped></style>