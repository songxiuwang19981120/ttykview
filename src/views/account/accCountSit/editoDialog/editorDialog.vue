<template>
  <div>
    <el-dialog :visible="showEditorDialog" :before-close="handlerClose">
      <span slot="title">
        <h1 class="tt-acccountsit--title">账号编辑</h1>
      </span>
      <div>
        编辑昵称 ： <el-input></el-input> <el-button >随机获取</el-button>
      </div>
      <div>
        编辑签名 ： <el-input></el-input> <el-button>随机获取</el-button>
      </div>
      <el-upload></el-upload>
      <el-button>随机获取</el-button>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerClose">取 消</el-button>
        <el-button type="primary" @click="handlerConfrim">确认并执行</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom";
import Pagination from "@/components/myComponent/table/pagination";

export default {
  name: "TtprojectEditorDialog",
  props: {
    showEditorDialog: {
      type: Boolean,
    },
  },
  components: { tableCustom, Pagination },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    handlerClose() {
      this.$emit("closeEditorDialog");
    },
  },
};
</script>

<style lang="stylus" scoped></style>