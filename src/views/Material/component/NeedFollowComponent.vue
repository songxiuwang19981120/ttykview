<template>
  <!-- <div> -->
  <el-dialog :visible.sync="showDialog" title="上传素材" width="60%" :before-close="cancelMaterial">
    <el-form ref="newMaterialform" :rules="newMaterialrules" :model="materialForm" label-width="200px">
      <el-form-item label="ID库:" prop="libraryId">
        <el-select v-model="materialForm.libraryId" placeholder="请选择ID库名称" style="width:80%" clearable filterable>
          <el-option v-for="item in searchIDList" :key="item.libraryid_id" :label="item.name"
            :value="item.libraryid_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="已有素材id（一行一个）:">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="materialForm.ids"
          placeholder="请输入已有的素材id，一行一个" style="width:80%"></el-input>
      </el-form-item>
      <el-form-item label="新素材链接：">
        <el-input v-model="materialForm.link" placeholder="请输入素材链接" style="width:80%" clearable>
          <el-button slot="append" :loading="searchLinking" @click="searchLink">{{ searchLinking ? '搜索中...'
              : '搜 索'
          }}</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <table-custom v-if="tableData.length > 0 ? true : false" :tableData="tableData" :columns="columns"></table-custom>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelMaterial">取 消</el-button>
      <el-button type="primary" :loading="materialSubmitting" @click="submitMaterial">{{ materialSubmitting ? '提交中...'
          : '提 交'
      }}</el-button>
    </span>
  </el-dialog>
  <!-- </div> -->

</template>

<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
export default {
  props: {
    searchIDList: {
      type: Array
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    tableCustom,
  },
  data() {
    return {
      searchLinking: false,
      tableData: [],
      columns: [
        {
          prop: 'avatar_pic',
          label: '头像',
          fixed: true,
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <el-image style="width: 50px; height: 50px" src={row.avatar_pic}></el-image>
              </div>
            );
          },
        },
        {
          prop: 'nickname',
          label: '昵称',
          align: 'center',
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
                <el-button style="margin-right:10px" size="mini" type="danger" onClick={this.removeLink.bind(this, row)}>删除</el-button>
              </div>
            );
          },
        },
      ],
      materialSubmitting: false,  //素材上传loading
      materialVisible: false, //素材上传显示
      materialForm: {
        libraryId: '',
        ids: '',
        link: '',
      },//上传素材数据
      newMaterialrules: {
        libraryId: [{ required: true, message: '请选择ID库', trigger: 'blur' }],
      }, //上传素材必填校验
    }
  },
  methods: {
    // 取消
    cancelMaterial() {
      this.materialForm = {
        libraryId: '',
        ids: '',
        link: '',
      }
      this.materialSubmitting = false
      this.tableData = []
      this.$emit('update:showDialog', false)
    },
    // 新增素材
    submitMaterial() {
      this.$refs['newMaterialform'].validate((valid) => {
        if (!valid) return false;
        this.materialSubmitting = true
        this.uidlibraryAdd()
      })
    },
    // 新增素材接口
    async uidlibraryAdd() {
      // let urls = this.tableData.map((item) => {
      //   return item.uid;
      // }).join("\n");
      let data = {
        // ids:this.materialForm.ids,
        libraryid_id: this.materialForm.libraryId,
        url: this.materialForm.ids,
      }
      try {
        let result = await this.$api({ type: "uidlibraryAdd", data: data });
        if (result.status == '200') {
          this.$message.success({ message: '素材上传成功' })
          this.cancelMaterial()
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error);
      }

    },
    // 搜索链接
    searchLink() {
      if (this.materialForm.link == '') {
        this.$message.warning({ message: '请输入查询链接' })
      } else {
        this.testGetRestByKeys()
      }
    },
    // 搜索链接,获取tk信息
    async testGetRestByKeys() {
      let data = {
        keyword: this.materialForm.link.replace('https://www.tiktok.com/@', ''),
      };
      try {
        this.searchLinking = true
        let result = await this.$api({ type: "testGetRestByKeys", data: data });
        this.searchLinking = false
        if (result.status == '200') {
          let list = result.data[0]
          this.tableData.push(list)
        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error);
      }
    },
    removeLink(row) {
      let id = row.uid
      this.tableData.forEach((item, index) => {
        if (id == item.uid) {
          return this.tableData.splice(index, 1)
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
