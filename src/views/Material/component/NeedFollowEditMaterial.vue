<template>
  <!-- <div> -->
  <el-dialog :visible.sync="editShowDialog" title="编辑素材" width="70%" :before-close="cancelMaterial">
    <table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
    <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelMaterial">取 消</el-button>
    </span>
  </el-dialog>
  <!-- </div> -->

</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
export default {
  props: {
    editShowDialog: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    tableCustom,
    pagination,
  },
  data() {
    return {
      total: 0,
      current_page: 1,
      current_limit: 10,
      loading: false,
      tableData: [],
      columns: [
        // {
        //   prop: 'url',
        //   label: '头像',
        //   fixed: true,
        //   align: 'center',
        //   render: (h, { row }) => {
        //     return (
        //       <div>
        //         <el-image style="width: 50px; height: 50px" src={row.url}></el-image>
        //       </div>
        //     );
        //   },
        // },
        {
          prop: 'uid',
          label: 'uid',
          align: 'center',
        },
        {
          prop: 'sec_uid',
          label: 'sec_uid',
          align: 'center',
        },
        {
          prop: 'url',
          label: '链接',
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <a href={row.url} target="_black">{row.url}</a>
              </div>
            );
          },
        },
        {
          prop: "operation",
          label: "操作",
          width: 100,
          align: "center",
          fixed: "right",
          render: (h, { row }) => {
            return (
              <div>
                <el-button style="margin-right:10px" size="mini" type="danger" onClick={this.removeMaterial.bind(this, row)}>删除</el-button>
              </div>
            );
          },
        },
      ],
      libraryidId:'',  //id库id
    }
  },
  methods: {
    getData(row) {
      this.libraryidId = row.libraryid_id
      this.getUidlibraryIndex()
    },
    // 编辑ID库
    async getUidlibraryIndex() {
      let data = {
        limit: this.current_limit,
        page: this.current_page,
        libraryid_id: this.libraryidId,
      };
      try {
        this.loading = true
        let result = await this.$api({ type: "uidlibraryIndex", data: data });
        this.loading = false
        if (result.status == '200') {
          this.tableData = result.data.list;
          this.total = result.data.count;
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 取消
    cancelMaterial() {
      this.tableData = []
      this.current_page=1
      this.current_limit = 10
      this.total= 0
      this.libraryidId= ''
      this.$emit('update:editShowDialog', false)
      this.$parent.getLibraryidIndex()

    },
    /*
      翻页回调
    */
    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //请求数据量
      this.getUidlibraryIndex();
    },
    // 删除素材
    async removeMaterial(row) {
      let data = {
        uidlibrary_ids: row.uidlibrary_id
      };
      try {
        let result = await this.$api({ type: "uidlibraryDelete", data: data });
        if (result.status == '200') {
          this.$message.success({ message: '删除成功' })
          if (this.current_page != 1) {
            if (this.tableData.length == 1) {
              this.current_page = this.current_page - 1
            }
          }
          this.getUidlibraryIndex()
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>

</style>
