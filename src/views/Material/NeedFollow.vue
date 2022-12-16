<template>
  <div>
    <div class="tt-accsituation">
      <div class="tt-accsituation--operation">
        <div>
          <span class="search-title">ID库名称:</span>
          <el-select v-model="searchTableData.id" placeholder="请选择ID库名称" style="width: 150px; margin-right: 20px"
            clearable filterable>
            <el-option v-for="item in searchIDList" :key="item.libraryid_id" :label="item.name"
              :value="item.name"></el-option>
          </el-select>
        </div>
        <el-button type="primary" :loading="submitting" @click="searchTable">{{
            submitting ? "搜索中 ..." : "搜索"
        }}</el-button>
        <el-button type="primary" @click="resetTable">重置</el-button>
      </div>
      <div class="tt-accsituation--operation">
        <el-button type="primary" @click="libraryVisible = true">新增ID库</el-button>
        <el-button type="primary" @click="uploadMaterialVisible = true">上传素材</el-button>
      </div>
    </div>
    <table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
    <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>

    <el-dialog title="新增ID库" :visible.sync="libraryVisible" width="40%" :before-close="cancelLibrary">
      <el-form ref="newlibraryform" :rules="newlibraryrules" :model="libraryForm" label-width="150px">
        <el-form-item label="ID库名称:" prop="name">
          <el-input v-model="libraryForm.name" placeholder="请输入ID库名称" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLibrary">取 消</el-button>
        <el-button type="primary" :loading="librarySubmitting" @click="submitlibrary">{{ librarySubmitting ?
            '提交中...' : '提 交'
        }}</el-button>
      </span>
    </el-dialog>


    <el-dialog title="编辑ID库" :visible.sync="editLibraryVisible" width="40%">
      <el-form ref="editLibraryform" :rules="editLibraryrules" :model="editLibraryForm" label-width="150px">
        <el-form-item label="ID库名称:" prop="name">
          <el-input v-model="editLibraryForm.name" placeholder="请输入ID库名称" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditLibrary">取 消</el-button>
        <el-button type="primary" :loading="editLibrarySubmitting" @click="submitEditLibrary">{{ editLibrarySubmitting ?
            '提交中...' : '提 交'
        }}</el-button>
      </span>
    </el-dialog>
    <upload-material :uploadShowDialog.sync="uploadMaterialVisible" :searchIDList="searchIDList"></upload-material>
    <edit-material ref="editMaterial" :editShowDialog.sync="editMaterialVisible"></edit-material>
  </div>
</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
import uploadMaterial from "./component/NeedFollowUploadMaterial.vue";
import editMaterial from "./component/NeedFollowEditMaterial.vue"
export default {
  name: "NeedFollow",
  components: {
    tableCustom,
    pagination,
    uploadMaterial,
    editMaterial,
  },
  data() {
    return {
      uploadMaterialVisible: false,  //上传素材
      editMaterialVisible: false,  //编辑素材
      editLibrarySubmitting: false, //ID库新增loading
      editLibraryVisible: false,  //编辑ID库
      libraryVisible: false,  //ID库新增
      librarySubmitting: false,  //ID库新增loading
      loading: false, //表格加载loading
      submitting: false, //提交确定
      total: 0, //数据总量
      current_page: 1, //当前页
      current_limit: 10, //每页条数
      searchTableData: {
        id: '',
      }, //搜索条件
      searchIDList: [], //搜索id库列表
      tableData: [], //表格数据
      columns: [
        {
          prop: "name",
          label: "ID库名称",
          align: "center",
        },
        {
          prop: "num",
          label: "素材数量",
          align: "center",
        },
        {
          prop: "operation",
          label: "操作",
          width: 270,
          align: "center",
          fixed: "right",
          render: (h, { row }) => {
            return (
              <div>
                <el-button size="mini" type="primary" onClick={this.libraryEdit.bind(this, row)}>编辑ID库</el-button>
                <el-button style="margin-right:10px" size="mini" type="success" onClick={this.materialEdit.bind(this, row)}>编辑素材</el-button>
                <el-popconfirm
                  confirm-button-text='删除'
                  cancel-button-text='取消'
                  title="确认删除此ID库？"
                  onConfirm={this.removeLibrary.bind(this, row)}
                >
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </div>
            );
          },
        },
      ], //表格
      libraryForm: {
        name: '',
      },  //新增ID库库form
      newlibraryrules: {
        name: [{ required: true, message: '请选择ID库', trigger: 'blur' }],
      }, //新增ID库必填校验
      editLibraryrules: {
        name: [{ required: true, message: '请选择ID库', trigger: 'blur' }],
      }, //编辑ID库必填校验
      editLibraryForm: {
        name: '',
        id: '',
      },  //修改ID库库form
    };
  },

  mounted() {
    this.getAllLibraryidIndex()
    this.getLibraryidIndex()
  },

  methods: {
    // 新增ID库取消
    cancelLibrary() {
      this.libraryVisible = false;
      this.libraryForm.name = '';
    },
    // 编辑ID库取消
    cancelEditLibrary() {
      this.editLibraryVisible = false;
      this.editLibraryForm.name = '';
      this.editLibraryForm.id = '';
    },
    // ID库编辑
    libraryEdit(row) {
      this.editLibraryVisible = true
      this.editLibraryForm.id = row.libraryid_id
      this.editLibraryForm.name = row.name
      console.log('ID库编辑', row);
    },
    // ID库删除
    async removeLibrary(row) {
      let data = {
        libraryid_ids: row.libraryid_id,
      };
      try {
        let result = await this.$api({ type: "libraryidDelete", data: data });
        if (result.status == '200') {
          this.$message.success({ message: '删除成功' })
          if (this.current_page != 1) {
            if (this.tableData.length == 1) {
              this.current_page = this.current_page - 1
            }
          }
          this.getLibraryidIndex()
          this.getAllLibraryidIndex()
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 素材编辑
    materialEdit(row) {
      this.editMaterialVisible = true
      this.$refs.editMaterial.getData(row);
    },
    // 新增ID库
    submitlibrary() {
      this.$refs['newlibraryform'].validate((valid) => {
        if (!valid) return false;
        this.librarySubmitting = true
        this.libraryidAdd()
      })
    },
    // 新增ID库
    async libraryidAdd() {
      let data = {
        name: this.libraryForm.name,
      };
      try {
        let result = await this.$api({ type: "libraryidAdd", data: data });
        this.librarySubmitting = false
        if (result.status == '200') {
          this.$message.success({ message: '新增成功' })
          this.getLibraryidIndex()
          this.getAllLibraryidIndex()
          this.libraryVisible = false
          this.libraryForm.name = ''
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        this.librarySubmitting = false
        console.error(error);
      }
    },
    // 编辑ID库
    submitEditLibrary() {
      this.$refs['editLibraryform'].validate((valid) => {
        if (!valid) return false;
        this.editLibrarySubmitting = true
        this.libraryidUpdate()
      })
    },
    // 编辑ID库
    async libraryidUpdate() {
      let data = {
        libraryid_id: this.editLibraryForm.id,
        name: this.editLibraryForm.name,
      };
      try {
        let result = await this.$api({ type: "libraryidUpdate", data: data });
        this.editLibrarySubmitting = false
        if (result.status == '200') {
          this.$message.success({ message: '修改成功' })
          this.getLibraryidIndex()
          this.getAllLibraryidIndex()
          this.editLibraryVisible = false
          this.editLibraryForm.name = ''
          this.editLibraryForm.id = ''
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        this.editLibrarySubmitting = false
        console.error(error);
      }
    },
    /*
      获取ID库列表
    */
    async getLibraryidIndex() {
      let data = {
        limit: this.current_limit,
        page: this.current_page,
        name: this.searchTableData.id,
      };
      try {
        this.loading = true;
        let result = await this.$api({ type: "libraryidIndex", data: data });
        if (result.status == '200') {
          this.tableData = result.data.list;
          this.total = result.data.count;
        } else {
          this.$message.error({ message: result.msg })
        }
        this.loading = false;
        this.submitting = false;
      } catch (error) {
        this.loading = false;
        this.submitting = false;
        console.error(error);
      }
    },
    /*
      获取全部ID库列表
    */
    async getAllLibraryidIndex() {
      let data = {
        limit: '10000000',
        page: '1'
      };
      try {
        let result = await this.$api({ type: "libraryidIndex", data: data });
        if (result.status == '200') {
          this.searchIDList = result.data.list;
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) { }
    },
    // 搜索数据
    searchTable() {
      this.submitting = true;
      this.getLibraryidIndex();
    },
    /*
      翻页回调
    */
    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //请求数据量
      this.getLibraryidIndex();
    },
    /*
      获取表格已选择的数据
    */
    selectionChange(val) {
      console.log(val);
    },
    /*
      搜索重置
    */
    resetTable() {
      this.searchTableData.id = '';
      this.getLibraryidIndex();
    },
  },
};
</script>

<style scoped>
.tt-accsituation {
  background-color: #fff;
  min-height: 70px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.tt-accsituation--operation {
  display: flex;
  justify-content: flex-start;
  flex-flow: wrap;
  align-items: center;
  padding: 10px;
}

.search-title {
  font-size: 13px;
  padding-right: 10px;
}
</style>