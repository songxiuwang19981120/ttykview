<template>
  <div>
    <el-dialog
      title="提示"
      :visible="showViewerTabel"
      width="80%"
      :before-close="handleClose"
    >
    <table-custom
        :loading="loading"
        :tableData="vistList"
        :columns="columns"
      ></table-custom>
    <Pagination 
      :total="visiterLength"
      :page="page"
      :size="limit"
      @pagination="handlePagination"
    />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/myComponent/table/pagination";
import tableCustom from "@/components/myComponent/table/tableCustom";
export default {
  name: "TtprojectVisitTabelDialog",
  props: {
    showViewerTabel: {
      type: Boolean,
    },
    vistList:{
        type:Array
    },
    member_id:{
        type:String
    }
  },
  computed:{
    visiterLength(){
        return this.vistList.length
    }
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
          prop: "nickname",
          label: "昵称",
          align: "center",
          width:'150'
        },
                        {
          prop: "country",
          label: "国家",
          align: "center",
        },
                                {
          prop: "signature",
          label: "签名",
          align: "center",
          minwidth:'200'
        },

        {
          prop: "avatar_thumb",
          label: "头像",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-image
                  src={row.avatar_thumb}
                  style="width: 60px; height: 60px"
                ></el-image>
              </div>
            );
          },
        },

                {
          prop: "aweme_count",
          label: "视频数量",
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

    handlePagination(){
        this.$emit('updateVisitorList',this.member_id)
    },

    handleClose(){
        this.$emit('toogleViewerTabel')
    }
  },
};
</script>

<style lang="stylus"></style>