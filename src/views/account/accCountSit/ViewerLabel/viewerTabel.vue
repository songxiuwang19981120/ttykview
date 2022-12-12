<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="showVisiteTabel"
      width="30%"
      :before-close="handleClose"
    >
    <table-custom
        :loading="loading"
        :tableData="videoList"
        :columns="columns"
      ></table-custom>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/myComponent/table/pagination";
import tableCustom from "@/components/myComponent/table/tableCustom";
export default {
  name: "TtprojectVisitTabelDialog",
  props: {
    showVisiteTabel: {
      type: Boolean,
    },
  },
  components: {
    Pagination,
    tableCustom,
  },
  data() {
    return {
        loading:false,
        columns:[
        {
          prop: "comment_count",
          label: "头像",
          align: "center",
        },
                {
          prop: "comment_count",
          label: "账号",
          align: "center",
        },
                {
          prop: "comment_count",
          label: "XX",
          align: "center",
        },
                {
          prop: "comment_count",
          label: "XX",
          align: "center",
        },
                {
          prop: "comment_count",
          label: "操作",
          align: "center",
          render:(h,{row})=>{
            return (
                <div>
                    <el-button>关注</el-button>
                    <el-button>回关</el-button>
                    <el-button>私信</el-button>
                </div>
            )
          }
        },
        ]
    };
  },

  mounted() {},

  methods: {
    handleClose(){
        this.$emit('toogleViewerTabel')
    }
  },
};
</script>

<style lang="stylus"></style>