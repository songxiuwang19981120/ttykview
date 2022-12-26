<template>
  <div class="AccountClass">
    <div style="background-color:white;padding:10px;border-radius: 8px">
      
      <span>设备分组选择：</span>
					<el-select v-model="searchTableData.equipment" placeholder="设备分组选择" style="margin-right: 20px"
						@change="getEquipmentGroup" :loading="equipmentLoading" loading-text="数据加载中...">
						<el-option v-for="item in searchEquipmentList" :key="item.grouping_id"
							:label="item.grouping_name" :value="item.grouping_id">
						</el-option>
					</el-select>

      <span style="margin-right:10px">设备分类选择:</span>
      <el-cascader :options="options" v-model="val_Tw" style="padding:0" :props="{ checkStrictly: true }">
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
        <div  style="margin-bottom:30px">
        <span>设备分组选择：</span>
					<el-select v-model="searchTableData1.equipment" placeholder="设备分组选择" style="margin-right: 20px"
						@change="getEquipmentGroupAdd" >
						<el-option v-for="item in searchEquipmentList" :key="item.grouping_id"
							:label="item.grouping_name" :value="item.grouping_id">
						</el-option>
					</el-select>
        </div>
        <div style="margin:0 0 30px 0px">
          <span style="margin-right:10px">设备分类选择:</span>
          <el-cascader :disabled="disabled" :options="options_tw" :props="defaultPropsa" v-model="val"
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
          <el-form-item label="新增分类名称:" label-width="100px">
            <el-input v-model="formNew.name" style="width:300px" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="closeadd()">取 消</el-button>
          <el-button type="primary" @click="TypecontrolAdd()">确 定</el-button>
        </div>

      </el-dialog>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData_tw_t" style="width: 100%;border-radius: 8px" row-key="value" lazy :load="load"
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
      searchEquipmentList:[],
      equipmentLoading:false,
      searchTableData:{
        equipment:""
      },//设备分组选择
      searchTableData1:{
        equipment:""
      },
      checked: false,//是否添加根目录
      disabled: false,//新增下拉是否禁用
      defaultPropsa: {
        checkStrictly: true
      },
      menudata: [],//下拉数据
      val: [],
      vals: [],
      menudata_t: [],
      val_Tw: [],
      vals_tee: [],
      vals_tree_t: [],
      //新的
      dialogNewVisible: false,//新增的弹窗显隐
      pid: "",//编辑的pid
      typecontrol_id: "",//修改主键ID
      dialogFormVisible: false,
      // total: 100,  //数据总量
      // page: 1, //当前页
      // limit: 10, //每页条数
      value: [],//联动绑定数据
      options: [],//联动的所有数据
      tableData_tw_t: [],//表格数据
      att: [],//表格数据拷贝用于for循环
      form: {
        name: '',
      },
      formNew: {
        name: '',
      },//新增分组名称
      options_tw:[],

    }
  },
  mounted() {
    this.Typecontrol();//联动数据
    this.getEquipmentGroup2();
  },

  methods: {
    
    //查询
    async getEquipmentGroup(){
      this.getEquipmentGroup2();
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data:{
            grouping_id:this.searchTableData.equipment
          }
        });
  
        this.options = result.data;
        this.filterTreeDate(result.data)//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },
    //查询
    async getEquipmentGroupAdd(){
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data:{
            grouping_id:this.searchTableData1.equipment
          }
        });
        if(result.status == 200){
            this.options_tw = result.data;
          this.$nextTick(() => {
            this.filterTreeDate(result.data)//联动后方无内容

          })
        
        }
     
      } catch (error) {
        console.error(error)
      }
    },
    		// 获取设备分组数据
		async getEquipmentGroup2() {
			try {
				this.equipmentLoading = true;
				const res = await this.$api({
					type: 'getGrouping',
				});
				if (res.status == 200) {
					this.searchEquipmentList = res.data.list;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.equipmentLoading = false;
			}
		},
    //重置按钮
    FnNewzh() {
      this.val_Tw = [];
      this.searchTableData={}
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
      this.vals_tree_t = [];
      this.vals_tree_t.push(this.vals[this.vals.length - 1])
      this.pid = this.vals_tree_t[0].typecontrol_id
    },
    //新增按钮确认
    async TypecontrolAdd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.name,
            pid: this.pid,
            grouping_id:this.searchTableData1.equipment
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
      this.searchTableData1.equipment=""

    },
    closeadd(){
      this.dialogNewVisible = false
      this.searchTableData1.equipment=""
      this.Typecontrol()
      this.dialogNewVisible = false
      this.checked = false;
      this.disabled = false;
      this.formNew.name = ""
      this.pid = ""
    },
    //四级联动点完后的事件
    getCascaderObj2(val_Tw, opt2) {
      return val_Tw.map(function (value, index, array) {
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
      this.vals_tee = this.getCascaderObj2(this.val_Tw, this.menudata_t); //选中节点数据 
      this.tableData_tw_t = [];
      this.vals_tee.forEach(item => {
        if (item.grouping_id==this.searchTableData.equipment) {
          this.tableData_tw_t.push(this.vals_tee[this.vals_tee.length - 1])//手动筛选只有使用分类没有分组
        } 
      })
      
    },
    //关闭联动后方无内容
    filterTreeDate(arr) {
      if(arr){
        arr.forEach(item => {
        if (!item.children.length) {
          item.children = undefined
        } else {
          this.filterTreeDate(item.children)
        }
      })
      }
    },
    //四级联动数据
    async Typecontrol() {
      try {
        let result = await this.$api({
          type: "getTypecontrol",
        });
        this.options = result.data;
        this.tableData_tw_t = result.data;
        this.menudata = result.data;
        this.menudata_t = result.data;
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
        this.Typecontrol()
      } catch (error) {
        console.error(error);
      }
    },
    //表格树形等待需要的话加入load
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(tree.children)
      }, 100)
    },
  },
};
</script>

<style scoped>

</style>