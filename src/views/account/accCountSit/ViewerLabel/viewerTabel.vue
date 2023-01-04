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
        height="700"
      ></table-custom>
      <Pagination
        :total="visterTotal || 0"
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
    vistList: {
      type: Array,
    },
    member_id: {
      type: String,
    },
    visterTotal: {
      type: Number,
    },
    user_id: {
      type: String,
    },
  },
  computed: {
    visiterLength() {
      return this.vistList.length;
    },
  },
  components: {
    Pagination,
    tableCustom,
  },
  data() {
    return {
      limit: 10,
      page: 1,
      loading: false,
      columns: [
        {
          prop: "nickname",
          label: "昵称",
          align: "center",
          width: "150",
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
          minwidth: "200",
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
          prop: "follower_status,follow_status",
          label: "操作",
          align: "center",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  onClick={this.handleFollow.bind(this, row)}
                  v-show={
                    row.follower_status === "0" && row.follow_status === "0"
                  }
                >
                  关注
                </el-button>
                <el-button
                  v-show={
                    row.follower_status === "1" && row.follow_status === "0"
                  }
                >
                  回关
                </el-button>
                <el-button v-show={row.follow_status === "2"}>私信</el-button>
              </div>
            );
          },
        },
      ],
    };
  },

  mounted() {},

  methods: {
    handlePagination(val) {
      (this.page = val.page),
        this.$emit("updateVisitorList", this.member_id, this.page);
    },

    handleClose() {
      this.$emit("toogleViewerTabel");
    },

    async handleFollow(val) {
      try {
        console.log(val, this.user_id);
        let data = {
          user_id: this.user_id,
          b_user_id: val.uid,
          b_sec_user_id: val.sec_uid,
        };
        let result = await this.$api({ type: "followUser", data: data });
        result.status === '200' ? this.$message.success(result.msg) : this.$message.error(result.msg)
      } catch (error) {
        console.error(error)
      }
    },
  },
};
</script>

<style lang="stylus" scoped></style>