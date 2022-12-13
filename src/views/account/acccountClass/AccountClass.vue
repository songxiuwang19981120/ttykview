<template>
  <div class="AccountClass">
    <div style="background-color:white;padding:10px">
      <span style="margin-right:10px">设备分组选择:</span>
      <el-cascader :options="options" v-model="value" style="padding:0" @change="handleChange"
        :props="{ checkStrictly: true }">
        <template slot-scope="{ node, data }">
          <span>
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </span>
        </template>
      </el-cascader>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData1" style="width: 100%" row-key="value" lazy :load="load"
      :tree-props="{ children: 'children' }">
      <el-table-column prop="label" label="名称" align="center" width="300">
      </el-table-column>
      <el-table-column prop="typecontrol_id" label="编号" align="center">
      </el-table-column>
      <el-table-column prop="status" width="180" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <!-- 修改 -->

        </template>
      </el-table-column>

    </el-table>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="修改名称:" label-width="100px">
          <el-input v-model="form.name" style="width:300px" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <!-- <pagination style="" :total="total" :page="page" :limit="10" :size="limit" @pagination="handlePagination">
    </pagination> -->

  </div>
</template>

<script>
import pagination from '@/components/myComponent/table/pagination.vue';
import { Footer } from 'element-ui';

export default {

  name: 'AccountClass',
  components: { pagination },
  data() {
    return {
      pid:"",//编辑的pid
      typecontrol_id:"",//修改主键ID
      dialogFormVisible: false,
      total: 100,  //数据总量
      // page: 1, //当前页
      // limit: 10, //每页条数
      value: [],//联动绑定数据
      value2: [],//联动数据最后一个
      options: [],//联动数据
      tableData1: [],//表格数据
      att: [],//表格数据拷贝
      form: {
        name: '',
      }

    }
  },
  mounted() {
    this.Typecontrol();//联动数据


  },

  methods: {

    //四级联动点完后的事件
    handleChange(value) {
      this.value2 = value[value.length - 1] ?? '';//传参
      console.log(this.value2)
      this.tableData1 = [];
      this.att = [];
      for (let i = 0; i < this.options.length; ++i) {
        if (this.options[i].value == this.value[0]) {
          this.att.push(this.options[i]);
          this.tableData1 = this.att;
          let _self = this;
          for (let j = 0; j < _self.att[0].children.length; ++j) {
            if (_self.att[0].children[j].value == value[1]) {
              _self.tableData1 = [];
              _self.tableData1.push(_self.att[0].children[j]);
              _self.att = _self.tableData1
              for (let g = 0; g < _self.att[0].children.length; ++g) {
                if (_self.att[0].children[g].value == value[2]) {
                  _self.tableData1 = [];
                  _self.tableData1.push(_self.att[0].children[g]);
                  _self.att = _self.tableData1
                  for (let f = 0; f < _self.att[0].children.length; ++f) {
                    if (_self.att[0].children[f].value == value[3]) {
                      _self.tableData1 = [];
                      _self.tableData1.push(_self.att[0].children[f]);
                      _self.att = _self.tableData1
                      console.log(value)
                    }
                  }
                }
              }
            }
          }

        }
      }
      console.log(this.tableData1)
    },
    //关闭联动后方无内容
    filterTreeDate(arr) {
      arr.forEach(item => {
        if (!item.children.length) {
          item.children = undefined
        } else {
          this.filterTreeDate(item.children)
        }
      })
    },
    //四级联动数据
    async Typecontrol() {
      try {
        let result = await this.$api({
          type: "getTypecontrol",
        });
        this.options = result.data;
        this.tableData1 = result.data
        this.filterTreeDate(result.data)//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },

    //操作
    handleEdit(index, row) {

      this.dialogFormVisible = true;
      this.form.name=row.label;//名称
      this.typecontrol_id=row.typecontrol_id//主键ID
      this.pid=row.pid//pid
    },
     handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.leDelete(index, row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //删除接口
    async leDelete(index, row) {
      console.log(index, row);
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: { 
            typecontrol_ids:row.typecontrol_id
           },
        });
        this.Typecontrol()
      } catch (error) {
        console.error(error);
      }
    },
    //提交修改
    async edit(){
      console.log(this.form.name)
      this.dialogFormVisible = false;
      try {
        let result = await this.$api({
          type: "updateTypecontrol",
          data: { 
            typecontrol_id:this.typecontrol_id,//主键
            type_title:this.form.name,//名称
            pid:this.pid
           },
        });
       console.log(result)
        this.Typecontrol()
      } catch (error) {
        console.error(error);
      }
    },
    //表格树形
    load(tree, treeNode, resolve) {
      console.log(tree)
      setTimeout(() => {
        resolve(tree.children)
      }, 100)
    },
    /**
//  * 翻页回调
//  */

//     async handlePagination(val) {
//       try {
//         console.log(val)
//         this.page = val.page;
//         this.limit = val.limit
//         let result = await this.$api({
//           type: "getTypecontrol",
//           data: { page: this.page,
//           limit:this.limit,
//           },
//         });
//         console.log(result)
//         this.tableData1=result.data
//       } catch (error) {
//         console.error(error);
//       }
//     },


  },
};
</script>

<style scoped>

</style>