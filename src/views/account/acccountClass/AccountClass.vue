<template>
  <div class="AccountClass">
    <div style="background-color:white;padding:10px;border-radius: 8px">
      <span style="margin-right:10px">设备分组选择:</span>

      <el-cascader :options="options" v-model="val2" style="padding:0" :props="{ checkStrictly: true }">
        <template slot-scope="{ node, data }">
          <span>
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </span>
        </template>
      </el-cascader>
      <el-button style="margin-left:20px" type="primary" @click="FnNewzh()">重置</el-button>
      <el-button type="primary" @click="handleChange2">搜索</el-button>
    </div>
    <!-- 新增按钮 -->
    <div style="background-color:white; margin: 10px 0 10px 0; padding: 10px;border-radius: 8px">
      <el-button type="primary" @click="dialogNewVisibleadd()"><i class="el-icon-plus"></i>新增</el-button>
      <!-- 新增弹窗 -->
      <el-dialog title="新增" :visible.sync="dialogNewVisible" width="30%">
        <div style="margin:0 0 30px 0px">
          <span style="margin-right:10px">设备分组选择:</span>
          <el-cascader :disabled="disabled" :options="options" :props="defaultPropsa" v-model="val"
            @change="menuchange"><template slot-scope="{ node, data }">
              <span>
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </span>
            </template>
          </el-cascader>
          <span @click="addlis()">
            <el-checkbox style="margin-left:20px" v-model="checked">是否添加根目录分组</el-checkbox>
          </span>
        </div>
        <el-form :model="formNew">
          <el-form-item label="新增分组名称:" label-width="100px">
            <el-input v-model="formNew.name" style="width:300px" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  type="danger" @click="dialogNewVisible = false">取 消</el-button>
          <el-button type="primary" @click="TypecontrolAdd()">确 定</el-button>
        </div>

      </el-dialog>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData1" style="width: 100%;border-radius: 8px" row-key="value" lazy :load="load"
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
      checked: false,//是否添加根目录
      disabled: false,//新增下拉是否禁用
      defaultPropsa: {
        checkStrictly: true
      },
      menudata: [],//下拉数据
      val: [],
      vals: [],
      menudata2: [],
      val2: [],
      vals2: [],
      vals3: [],
      //新的
      dialogNewVisible: false,//新增的弹窗显隐
      value3: [],//新增四级下拉
      pid: "",//编辑的pid
      typecontrol_id: "",//修改主键ID
      dialogFormVisible: false,
      // total: 100,  //数据总量
      // page: 1, //当前页
      // limit: 10, //每页条数
      value: [],//联动绑定数据
      value2: [],//联动数据最后一个
      options: [],//联动的所有数据
      tableData1: [],//表格数据
      att: [],//表格数据拷贝用于for循环
      form: {
        name: '',
      },
      formNew: {
        name: '',
      }//新增分组名称

    }
  },
  mounted() {
    this.Typecontrol();//联动数据
  },

  methods: {
    //重置按钮
    FnNewzh() {
      this.val2 = [];
      this.Typecontrol()
    },
    //新增按钮打开
    dialogNewVisibleadd() {
      this.dialogNewVisible = true;
      this.val = [];
      this.formNew.name = ""
    },
    //是否根目录
    addlis() {
      this.val = "";
      if (this.checked == true) {
        this.disabled = false;
        this.pid = 0
      } else {
        this.disabled = true;
      }
    },
    //新增的四级下拉
    //element组件里的 getCheckedNodes	获取选中的节点	
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value == value) {
            opt = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    //联动change事件
    menuchange() {
      this.vals = this.getCascaderObj(this.val, this.menudata); //选中节点数据
      console.log(this.vals)
      this.vals3 = [];
      this.vals3.push(this.vals[this.vals.length - 1])
      this.pid = this.vals3[0].typecontrol_id
    },
    //新增按钮确认
    async TypecontrolAdd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.name,
            pid: this.pid
          },
        });
        if (result.status == '200') {
          this.$message.success('新增成功');
        }
        else {
          this.$message.error(result.msg)
        }
      } catch (error) {
        console.error(error);
      }
      this.Typecontrol()
      this.dialogNewVisible = false
      this.checked = false;
      this.disabled = false;
      this.formNew.name = ""
      this.pid = ""

    },
    //四级联动点完后的事件
    getCascaderObj2(val2, opt2) {
      return val2.map(function (value, index, array) {
        for (var itm of opt2) {
          if (itm.value == value) {
            opt2 = itm.children;
            return itm;
          }
        }
        return null;
      });
    },
    handleChange2() {
      this.vals2 = this.getCascaderObj2(this.val2, this.menudata2); //选中节点数据
      console.log(this.vals2);
      console.log(this.vals2[this.vals2.length - 1]);
      this.tableData1 = [];
      this.tableData1.push(this.vals2[this.vals2.length - 1])
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
        this.tableData1 = result.data;
        this.menudata = result.data;
        this.menudata2 = result.data;
        console.log(result)
        this.filterTreeDate(result.data)//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },

    //操作
    handleEdit(index, row) {

      this.dialogFormVisible = true;
      this.form.name = row.label;//名称
      this.typecontrol_id = row.typecontrol_id//主键ID
      this.pid = row.pid//pid
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
            typecontrol_ids: row.typecontrol_id
          },
        });
        this.Typecontrol()
      } catch (error) {
        console.error(error);
      }
    },
    //提交修改
    async edit() {
      console.log(this.form.name)
      this.dialogFormVisible = false;
      try {
        let result = await this.$api({
          type: "updateTypecontrol",
          data: {
            typecontrol_id: this.typecontrol_id,//主键
            type_title: this.form.name,//名称
            pid: this.pid
          },
        });
        console.log(result)
        this.Typecontrol()
      } catch (error) {
        console.error(error);
      }
    },
    //表格树形等待需要的话加入load
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