<template>
  <div class="AccountClass">
    <div style="padding:10px">

      <el-select v-model="searchTableData.equipment" placeholder="账号分组选择" style="margin-right: 20px"
        @change="getTypecontrol" :loading="equipmentLoading" loading-text="数据加载中...">
        <el-option v-for="item in searchEquipmentList" :key="item.grouping_id" :label="item.grouping_name"
          :value="item.grouping_id">
        </el-option>
      </el-select>




      <el-cascader :options="options" v-model="val_Tw" style="padding:0" :props="{ checkStrictly: true }"
        placeholder="账号分类选择">
        <template slot-scope="{ node, data }">
          <span>
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </span>

        </template>
      </el-cascader>
      <el-button style="margin-left:20px" type="primary" @click="FnNewzh()" size="medium">重置</el-button>
      <el-button type="primary" @click="handleChange_search" size="medium">搜索</el-button>
      <el-button type="primary" @click="dialogNewVisibleadd()" size="medium"><i class="el-icon-plus"></i>新增</el-button>

    </div>
    <!-- 新增按钮 -->
    <!-- 新增弹窗 -->
    <el-dialog title="新增分类" :visible.sync="dialogNewVisible" width="700px" :before-close="closeadd">
      <el-form ref="form" :rules="rules" :model="formNew" label-width="140px">
        <el-form-item label="选择账号分组:" prop="equipment">
          <el-select v-model="formNew.equipment" placeholder="账号分组选择" style="margin-right: 20px;width:200px"
            @change="getEquipmentGroupAdd">
            <el-option v-for="item in searchEquipmentList" :key="item.grouping_id" :label="item.grouping_name"
              :value="item.grouping_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择账号分类:">




          <el-select
           :disabled="disabledacc.first_level" 
           v-model="formNew.first_level"
            placeholder="一级" 
            ref="template"
            
            @change="first_levelFn"
            @visible-change="(v) => visibleChange(v, 'template')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in options_tw" :key="item.typecontrol_id" :label="item.label" :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>
              
               
              <span style="float: right">
                <i  class="el-icon-close" slot="reference"	@click=removeHandler(item) ></i>
              </span>
   
    
            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.second_level" v-model="formNew.second_level" placeholder="二级"
            ref="template1" @change="second_levelFn" @visible-change="(v) => visibleChange1(v, 'template1')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in searchEquipmentList_second_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>
              <span style="float: right">
                <i  class="el-icon-close" slot="reference"	@click=removeHandler1(item) ></i>
              </span>
   

            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.three_level" v-model="formNew.three_level" placeholder="三级" ref="template2"
            @change="three_levelFn" @visible-change="(v) => visibleChange2(v, 'template2')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in searchEquipmentList_three_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>

  
              <span style="float: right">
                <i  class="el-icon-close" slot="reference"	@click=removeHandler2(item) ></i>
              </span>
   
            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.four_level" v-model="formNew.four_level" placeholder="四级" ref="template3"
            @change="four_levelFn" @visible-change="(v) => visibleChange3(v, 'template3')" style="width:120px">
            <el-option v-for="item in searchEquipmentList_four_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>
  
              <span style="float: right">
                <i  class="el-icon-close" slot="reference"	@click=removeHandler3(item) ></i>
              </span>
   

            </el-option>
          </el-select>



        </el-form-item>
        <!-- <el-form-item label="新增分类展示:" prop="name">
          <el-input :disabled="disabled_name" v-model="formNew.name" style="width:200px"
            placeholder="新增分类展示"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeadd">关 闭</el-button>
        <!-- <el-button type="primary" @click="closeadd" :loading="submitting">{{
          submitting? '提交中 ...': '确定'
        }}</el-button> -->
      </span>
    </el-dialog>

    <!-- 表格 -->
    <tableCustom height="600" :tableData="tableData_tw_t" row-key="value" :columns="columns" :load="load"
      :loading="loading">
    </tableCustom>

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


      <!-- 确认删除 -->
      <el-dialog
 :title="'确认删除'+'-'+deleteclass.label+'-'+'分类?'"
  :visible.sync="centerdeleteDialogVisible"
  width="20%"
  >
  <div style="margin-left:30%"></div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerdeleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="removeHandlerOK()">确 定</el-button>
  </span>
</el-dialog>
      <!-- 确认删除 -->
      <el-dialog
 :title="'确认删除'+'-'+deleteclass.label+'-'+'分类?'"
  :visible.sync="centerdeleteDialogVisible1"
  width="20%">
  <div style="margin-left:30%"></div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerdeleteDialogVisible1 = false">取 消</el-button>
    <el-button type="primary" @click="removeHandlerOK2()">确 定</el-button>
  </span>
</el-dialog>
      <!-- 确认删除 -->
      <el-dialog
 :title="'确认删除'+'-'+deleteclass.label+'-'+'分类?'"
  :visible.sync="centerdeleteDialogVisible2"
  width="20%">
  <div style="margin-left:30%"></div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerdeleteDialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="removeHandlerOK3()">确 定</el-button>
  </span>
</el-dialog>
      <!-- 确认删除 -->
      <el-dialog
 :title="'确认删除'+'-'+deleteclass.label+'-'+'分类?'"
  :visible.sync="centerdeleteDialogVisible3"
  width="20%">
  <div style="margin-left:30%"></div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="centerdeleteDialogVisible3 = false">取 消</el-button>
    <el-button type="primary" @click="removeHandlerOK4()">确 定</el-button>
  </span>
</el-dialog>
    <!-- 分页 -->
    <!-- <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
    </pagination> -->

  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
import { Footer } from 'element-ui';

export default {

  name: 'AccountClass',
  components: { pagination, tableCustom },
  data() {
    return {
      centerdeleteDialogVisible:false,//下拉删除的弹窗
      centerdeleteDialogVisible1:false,//下拉删除的弹窗
      centerdeleteDialogVisible2:false,//下拉删除的弹窗
      centerdeleteDialogVisible3:false,//下拉删除的弹窗
      
      
      deleteclass:"",//下拉选择的单个删除
      options_tww: [],//第一级下拉
      loading: false,
      labelslist: [],
      submitting: false,
      rules: {
        equipment: [{ required: true, message: '请选择账号分组', trigger: 'blur' }],
        group: [{ required: true, message: '请选择账号分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      columns: [
        {
          prop: 'label',
          label: '名称',
          align: 'center',
          width: 300
        },
        {
          prop: 'typecontrol_id',
          label: '编号',
          align: 'center',
        },
        {
          prop: "status",
          label: '操作',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            return (
              <div>
                <el-button size="mini" type="primary" onClick={this.handleEdit.bind(this, row)}>编辑</el-button>
                <el-button size="mini" type="danger" onClick={this.handleDelete.bind(this, row)}>删除</el-button>
              </div>
            );
          },
        },
      ],
      searchEquipmentList: [],
      equipmentLoading: false,
      searchTableData: {
        equipment: ""
      },//账号分组选
      checked: false,//是否添加根目录
      disabled: false,//新增下拉是否禁用
      defaultPropsa: {
        checkStrictly: true
      },
      first_label: "",
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
      pidd: "",
      typecontrol_id: "",//修改主键ID
      dialogFormVisible: false,
      total: 0,  //数据总量
      current_page: 1, //当前页
      current_limit: 10, //每页条数
      value: [],//联动绑定数据
      options: [],//联动的所有数据
      tableData_tw_t: [],//表格数据
      att: [],//表格数据拷贝用于for循环
      form: {
        name: '',
      },
      formNew: {
        firstch: "",
        secch: "",
        threech: "",
        fourch: "",
        name: "",
        first_level: "",//一级分类
        second_level: "",//二级分类
        three_level: "",
        four_level: "",
        equipment: ""
      },//新增分组名称
      options_tw: [],
      disabled_name: true,//新增分类展示禁用状态
      //下拉是否显示
      disabledacc: {
        first_level: true,//一级分类
        second_level: true,//二级分类
        three_level: true,
        four_level: true,
      },
      //下拉数据
      searchEquipmentList_second_level: [],
      searchEquipmentList_three_level: [],
      searchEquipmentList_four_level: [],
    }
  },
  mounted() {
    this.Typecontrolindex();//联动数据
    this.getEquipmentGroup();
  },

  methods: {
    /*
          翻页回调
       */
    handlePagination(val) {
      this.current_page = val.page;  //页数
      this.current_limit = val.limit  //条数
      this.Typecontrolindex()
    },

    //获取账号分类
    async getTypecontrol() {
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data: {
            grouping_id: this.searchTableData.equipment
          }
        });
        if (result.status == 200) {
          this.formNew.equipment = result.data.grouping_id
          this.options = result.data;
          this.filterTreeDate(result.data)
        }//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },
    //通过分组找一级分类数据
    async getEquipmentGroupAdd() {
      this.disabledacc = {
        first_level: false,//一级分类
      second_level: true,
      three_level :true,
      four_level :true,
      },
      this.formNew.first_level = ""
      this.formNew.second_level = ""
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data: {
            grouping_id: this.formNew.equipment
          }
        });
        if (result.status == 200) {
          this.options_tw = result.data;
          console.log(result, "123")
          this.$nextTick(() => {
            this.filterTreeDate(result.data)//联动后方无内容
          })
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error(error)
      }
    },
    //通过分组找一级分类数据2
    async getEquipmentGroupAAdd() {
      this.disabledacc = {
      three_level :false,
      four_level :true,
      };
      
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data: {
            grouping_id: this.formNew.equipment
          }
        });
        if (result.status == 200) {
          this.options_tw = result.data;
          this.$nextTick(() => {
            this.filterTreeDate(result.data)//联动后方无内容
          })
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error(error)
      }
    },
   
    //通过分组找一级分类数据3
    async getEquipmentGroupAAddd() {
      this.formNew.four_level = ""
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data: {
            grouping_id: this.formNew.equipment
          }
        });
        if (result.status == 200) {
          this.options_tw = result.data;
          console.log(result, "123")
          this.$nextTick(() => {
            this.filterTreeDate(result.data)//联动后方无内容
          })
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.error(error)
      }
    },
   
    //第一个下拉分类change事件
    async first_levelFn(val) {
      let _self = this;
      _self.searchEquipmentList_second_level=[]
      this.disabledacc.second_level = false;
      this.disabledacc.three_level = true;
      this.disabledacc.four_level = true;
      this.formNew.name = ""
      this.formNew.second_level = ""
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      if (val) {
        this.options_tw.forEach(item => {
          if (item.value == val) {
            this.formNew.firstch = item.label
            this.pidd=item.typecontrol_id
            }
        });
        try {
          let result = await this.$api({
            type: "getTypecontrol",
          });
          if (result.status == 200) {

            result.data.forEach(item => {
          if (item.value == val) {
            item.children.forEach(itemt => {
              _self.searchEquipmentList_second_level.push(itemt)
            })
          }
        });
            console.log(this.searchEquipmentList_second_level, "二级分类数据")
          } else {
            this.$message.error(res.msg);

          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    //第二个下拉分类change事件
      second_levelFn(val) {
      let _self = this
      _self.searchEquipmentList_three_level=[]
      this.disabledacc.four_level = true;
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      //获得第三级的数据数组
      if (val) {
        this.disabledacc.three_level = false;
        this.searchEquipmentList_second_level.forEach(item => {
          if (item.value == val) {
            _self.pidd=item.typecontrol_id//获取第三级要加到哪个PID上
            item.children.forEach(element => {
              _self.searchEquipmentList_three_level.push(element)
              console.log(_self.searchEquipmentList_three_level,'三级下拉数据')
            });

          }
        });
      }
      console.log(this.searchEquipmentList_second_level)


    },
    //第三个下拉分类change事件
    three_levelFn(val) {
      let _self = this
      _self.formNew.four_level=''
      _self.searchEquipmentList_four_level=[]
      this.disabledacc.four_level = false;
      if (val) {
        this.disabledacc.four_level = false;
        if( this.searchEquipmentList_three_level){
        this.searchEquipmentList_three_level.forEach(item => {
          if (item.value == val) {
            _self.pidd=item.typecontrol_id//获取第四级要加到哪个PID上
            item.children.forEach(element => {
              _self.searchEquipmentList_four_level.push(element)
              console.log(_self.searchEquipmentList_four_level,'四级下拉数据')
            });
          }
        });}
      }
      console.log(this.pidd,"pid")
    },
    //第四个个下拉分类change事件
    four_levelFn(val) {
      if (val) {
        this.searchEquipmentList_four_level.forEach(item => {
          if (item.value == val) {
            this.formNew.fourch = item.label
            this.formNew.name = this.formNew.firstch + '/' + this.formNew.secch + '/' + this.formNew.threech + '/' + this.formNew.fourch
          }
        });
      }
    },
    // 获取账号分组数据
    async getEquipmentGroup() {
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
      this.searchTableData.equipment = ""
      this.val_Tw = "";
      this.options = [];

      this.Typecontrolindex()
    },

    //新增按钮打开
    dialogNewVisibleadd() {
      this.dialogNewVisible = true;
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
      this.vals = this.getCascaderObj(this.formNew.group, this.menudata); //选中节点数据
      this.vals_tree_t = [];
      this.vals_tree_t.push(this.vals[this.vals.length - 1])
      this.pid = this.vals_tree_t[0].typecontrol_id
    },
   

//


   
    //新增接口
    async TypecontrolAdd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.first_level,
            pid: 0,
            grouping_id: this.formNew.equipment
          },
        });

        if (result.status == '200') {
          this.Typecontrol()
          this.pidd = result.data
          
        }
        else {
          this.$message.error(result.msg)
        }
      } catch (error) {
        console.error(error);
      }
    },
    //新增按钮确认2
    async TypecontrolAddd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.second_level,
            pid: this.pidd,
            grouping_id: this.formNew.equipment
          },
        });

        if (result.status == '200') {
          this.Typecontrol()

        }
        else {
          this.$message.error(result.msg)
        }
      } catch (error) {
        console.error(error);
      }
    },
    //新增按钮确认3
    async TypecontrolAdddd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.three_level,
            pid: this.pidd,
            grouping_id: this.formNew.equipment
          },
        });

        if (result.status == '200') {
          this.Typecontrol()
        }
        else {
          this.$message.error(result.msg)
        }
      } catch (error) {
        console.error(error);
      }
    },
    //新增按钮确认4
    async TypecontrolAddddd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.four_level,
            pid: this.pidd,
            grouping_id: this.formNew.equipment
          },
        });

        if (result.status == '200') {
          this.Typecontrol()
        }
        else {
          this.$message.error(result.msg)
        }
      } catch (error) {
        console.error(error);
      }
    },
    closeadd() {
      this.$refs.form.resetFields();
      this.options_tw = []
      this.dialogNewVisible = false
      this.checked = false;
      this.disabled = false;
      this.formNew.equipment = ""
      this.formNew.group = ""
      this.formNew.name = ""
      this.pid = ""
      this.formNew.first_level = ""
      this.formNew.second_level = ""
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      this.disabledacc = {
        first_level: true,//一级分类
        second_level: true,//二级分类
        three_level: true,
        four_level: true,
      }
      this.Typecontrolindex()
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
    handleChange_search() {
      this.vals_tee = this.getCascaderObj2(this.val_Tw, this.menudata_t); //选中节点数据 
      console.log(this.val_Tw, this.menudata_t)
      this.tableData_tw_t = [];
      console.log(this.vals_tee)
      this.vals_tee.forEach(item => {
        if (item.grouping_id == this.searchTableData.equipment) {
          this.tableData_tw_t.push(this.vals_tee[this.vals_tee.length - 1])//手动筛选只有使用分类没有分组
        }
      })

    },
    //关闭联动后方无内容
    filterTreeDate(arr) {
      if (arr) {
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
      let data = {
        limit: this.current_limit,
        page: this.current_page,
      }
      try {
        
        let result = await this.$api({
          type: "getTypecontrol",
          data: data
        });
        if (result.status == '200') {
          this.menudata = result.data;
          this.menudata_t = result.data;
          this.filterTreeDate(result.data)//联动后方无内容

        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error)
      } finally {
     
      }

    },
    //数据index
    async Typecontrolindex() {
      let data = {
        limit: this.current_limit,
        page: this.current_page,
      }
      try {
        this.loading = true
        let result = await this.$api({
          type: "getTypecontrol",
          data: data
        });
        if (result.status == '200') {

          this.tableData_tw_t = result.data;
          this.menudata = result.data;
          this.menudata_t = result.data;
          this.filterTreeDate(result.data)//联动后方无内容

        } else {
          this.$message.error({ message: result.msg })
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }

    },

    //操作
    handleEdit(row) {

      this.dialogFormVisible = true;
      this.form.name = row.label;//名称
      this.typecontrol_id = row.typecontrol_id//主键ID
      this.pid = row.pid//pid
    },
    handleDelete(row) {
      this.typecontrol_id = row.typecontrol_id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.leDelete()
        this.FnNewzh()
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
    async leDelete() {
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: {
            typecontrol_ids: this.typecontrol_id
          },
        });
        this.Typecontrolindex()
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
        
        this.FnNewzh()
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


    // 下拉添加分类按钮
     showShipTemplate() {
     this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async({ value }) => {
        this.formNew.first_level=value
        await this.TypecontrolAdd()
         await this.getEquipmentGroupAdd()
        await this.first_levelFn(value)
        this.formNew.first_level=value
        
      });
    },
    visibleChange(visible, refName) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (
          !Array.from(popper.children).some(
            (v) => v.className === "el-template-menu__list"
          )
        ) {
          const el = document.createElement("ul");
          el.className = "el-template-menu__list";
          el.style =
            "border-top:2px solid rgb(219 225 241); padding:0; color:rgb(64 158 255);font-size: 13px";
          el.innerHTML = `<li class="el-cascader-node text-center" style="height:37px;line-height: 50px;margin-left:10px;">
            <span class="el-cascader-node__label"><i class="font-blue el-icon-plus"></i>添加分类</span>
            </li>`;
          popper.appendChild(el);
          el.onclick = () => {
            this.showShipTemplate(null, false);
          };
        }
      }
    },
    searchEquipmentList_second_levelFNN(){
      this.searchEquipmentList_second_level=[]
      this.formNew.three_level=''
      this.formNew.four_level=''
    },
    second_level(value){
      this.formNew.second_level=value
    },
    get_pidd2(){
      this.options_tw.forEach(item => {
          if(item.value== this.formNew.first_level){
         this.pidd=item.typecontrol_id
          }else if(item.label== this.formNew.first_level){
            this.pidd=item.typecontrol_id
          }
        });
      },
    // 下拉添加分类按钮1
    showShipTemplate1() {
       this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async({ value }) => {
        await this.second_level(value)
        await this.get_pidd2()
        await this.TypecontrolAddd()
         await this.getEquipmentGroupAAdd()

        await this.searchEquipmentList_second_levelFNN()
         await this.second_level(value)
         await this.options_tw.forEach(item => {
          //value唯一id值
          if (item.value ==  this.formNew.first_level) {
            item.children.forEach(itemt => {
              this.searchEquipmentList_second_level.push(itemt)
            })
          }else if(item.label ==  this.formNew.first_level){
            item.children.forEach(itemt => {
              this.searchEquipmentList_second_level.push(itemt)
            })
          }
        });

        this.searchEquipmentList_second_level.forEach(item => {
          if(item.value ==  this.formNew.second_level){
            this.searchEquipmentList_three_level=item.children
          }else if(item.label ==  this.formNew.second_level){
            this.searchEquipmentList_three_level=item.children
          }
        });

      });
      
    },
    visibleChange1(visible, refName) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (
          !Array.from(popper.children).some(
            (v) => v.className === "el-template-menu__list"
          )
        ) {
          const el = document.createElement("ul");
          el.className = "el-template-menu__list";
          el.style =
            "border-top:2px solid rgb(219 225 241); padding:0; color:rgb(64 158 255);font-size: 13px";
          el.innerHTML = `<li class="el-cascader-node text-center" style="height:37px;line-height: 50px;margin-left:10px;">
            <span class="el-cascader-node__label"><i class="font-blue el-icon-plus"></i>添加分类</span>
            </li>`;
          popper.appendChild(el);
          el.onclick = () => {
            this.showShipTemplate1(null, false);
          };
        }
      }
    },


    three_level(value){
      this.formNew.three_level=value
      this.formNew.four_level=''
      this.options_tw=[]
      this.searchEquipmentList_second_level=[]
      this.searchEquipmentList_three_level=[]
    },
    get_pidd3(){
console.log(this.options_tw)
      this.options_tw.forEach(item => {
        if (item.value ==  this.formNew.first_level) {
              this.searchEquipmentList_second_level=item.children     
          }else if(item.label ==  this.formNew.first_level){       
              this.searchEquipmentList_second_level=item.children
          }
        });

      this.searchEquipmentList_second_level.forEach(item => {
          if(item.value== this.formNew.second_level){
         this.pidd=item.typecontrol_id
   
          }else if(item.label== this.formNew.second_level){
            this.pidd=item.typecontrol_id
       
          }
        });

    },
    
    three_leve21(value){
      this.formNew.three_level=value
    },
    // 下拉添加分类按钮2
    showShipTemplate2() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async({ value }) => {
        await this.get_pidd3() //获取上一级pid
        await this.three_level(value)
        await this.TypecontrolAdddd()//新增上去
         await this.getEquipmentGroupAAdd()//获得最新的options_tw
  
        //  await this.three_level(value)

         await this.options_tw.forEach(item => {
          if (item.value ==  this.formNew.first_level) {
            item.children.forEach(itemt => {
              this.searchEquipmentList_second_level.push(itemt)
            })
          }else if(item.label ==  this.formNew.first_level) {
        item.children.forEach(itemt => {
          this.searchEquipmentList_second_level.push(itemt)
      })
    }
        });

        await this.searchEquipmentList_second_level.forEach(item => {
          if(item.value== this.formNew.second_level){
            
            this.searchEquipmentList_three_level=item.children
          }else if(item.label== this.formNew.second_level){
          
            this.searchEquipmentList_three_level=item.children
          }
        });
       await this.three_leve21(value)
        this.disabledacc.four_level=false
      });
      
    },
    visibleChange2(visible, refName) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (
          !Array.from(popper.children).some(
            (v) => v.className === "el-template-menu__list"
          )
        ) {
          const el = document.createElement("ul");
          el.className = "el-template-menu__list";
          el.style =
            "border-top:2px solid rgb(219 225 241); padding:0; color:rgb(64 158 255);font-size: 13px";
          el.innerHTML = `<li class="el-cascader-node text-center" style="height:37px;line-height: 50px;margin-left:10px;">
            <span class="el-cascader-node__label"><i class="font-blue el-icon-plus"></i>添加分类</span>
            </li>`;
          popper.appendChild(el);
          el.onclick = () => {
            this.showShipTemplate2(null, false);
          };
        }
      }
    },



    get_pidd4(){
      console.log(this.options_tw)
      this.options_tw.forEach(item => {
        if (item.value ==  this.formNew.first_level) {
              this.searchEquipmentList_second_level=item.children     
          }else if(item.label ==  this.formNew.first_level){       
              this.searchEquipmentList_second_level=item.children
          }
        });
      this.searchEquipmentList_second_level.forEach(item => {
        if (item.value ==  this.formNew.second_level) {
              this.searchEquipmentList_three_level=item.children     
          }else if(item.label ==  this.formNew.second_level){       
              this.searchEquipmentList_three_level=item.children
          }
        });
     
      this.searchEquipmentList_three_level.forEach(item => {
          if(item.value== this.formNew.three_level){
         this.pidd=item.typecontrol_id
          }else if(item.label== this.formNew.three_level){
            this.pidd=item.typecontrol_id
       
          }
        });

    },
    four_level(value){
      this.formNew.four_level=value
      this.options_tw=[]
      this.searchEquipmentList_second_level=[]
      this.searchEquipmentList_three_level=[]
      this.searchEquipmentList_four_level=[]
    },
    four_leve21(value){
      this.formNew.four_level=value
    },
    // 下拉添加分类按钮3
    showShipTemplate3() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async({ value }) => {
        await this.get_pidd4()
        await this.four_level(value)
        await this.TypecontrolAddddd()//新增上去
        await this.getEquipmentGroupAAdd()//获得最新的options_tw
       
        
        await this.options_tw.forEach(item => {
          if (item.value ==  this.formNew.first_level) {
            item.children.forEach(itemt => {
              this.searchEquipmentList_second_level.push(itemt)
            })
          }else if(item.label ==  this.formNew.first_level) {
        item.children.forEach(itemt => {
          this.searchEquipmentList_second_level.push(itemt)
      })
    }
        });

        await this.searchEquipmentList_second_level.forEach(item => {
          if(item.value== this.formNew.second_level){
            
            this.searchEquipmentList_three_level=item.children
          }else if(item.label== this.formNew.second_level){
          
            this.searchEquipmentList_three_level=item.children
          }
        });


        await this.searchEquipmentList_three_level.forEach(item => {
          if(item.value== this.formNew.three_level){
            
            this.searchEquipmentList_four_level=item.children
          }else if(item.label== this.formNew.three_level){
          
            this.searchEquipmentList_four_level=item.children
          }
        });

       
       await this.four_leve21(value)
        this.disabledacc.four_level=false

      });
    },
    visibleChange3(visible, refName) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (
          !Array.from(popper.children).some(
            (v) => v.className === "el-template-menu__list"
          )
        ) {
          const el = document.createElement("ul");
          el.className = "el-template-menu__list";
          el.style =
            "border-top:2px solid rgb(219 225 241); padding:0; color:rgb(64 158 255);font-size: 13px";
          el.innerHTML = `<li class="el-cascader-node text-center" style="height:37px;line-height: 50px;margin-left:10px;">
            <span class="el-cascader-node__label"><i class="font-blue el-icon-plus"></i>添加分类</span>
            </li>`;
          popper.appendChild(el);
          el.onclick = () => {
            this.showShipTemplate3(null, false);
          };
        }
      }
    },
    

    // 分组内删除
    removeHandler(item){
      console.log(item)
      this.deleteclass=item;
      this.centerdeleteDialogVisible=true
      this.typecontrol_id=item.typecontrol_id
    },
    // 分组内删除
    removeHandler1(item){
      console.log(item)
      this.deleteclass=item;
      this.centerdeleteDialogVisible1=true
      this.typecontrol_id=item.typecontrol_id
    },
    // 分组内删除
    removeHandler2(item){
      console.log(item)
      this.deleteclass=item;
      this.centerdeleteDialogVisible2=true
      this.typecontrol_id=item.typecontrol_id
    },
    // 分组内删除
    removeHandler3(item){
      console.log(item)
      this.deleteclass=item;
      this.centerdeleteDialogVisible3=true
      this.typecontrol_id=item.typecontrol_id
    },
    //确认删除
    async removeHandlerOK(){
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: {
            typecontrol_ids: this.typecontrol_id
          },
        });
        if(result.status==200){
          this.getEquipmentGroupAdd()
          this.disabledacc.second_level = true;
          this.disabledacc.three_level = true;
          this.disabledacc.four_level = true;
          this.Typecontrol()
          this.formNew.first_level=""
          this.centerdeleteDialogVisible=false
        }
        
      } catch (error) {
        console.error(error);
      }
  
    },
    //确认删除
    async removeHandlerOK2(){
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: {
            typecontrol_ids: this.typecontrol_id
          },
        });
        if(result.status==200){
          this.first_levelFn()
          this.Typecontrol()
          this.centerdeleteDialogVisible1=false
        }
        
      } catch (error) {
        console.error(error);
      }
  
    },
    //确认删除
    async removeHandlerOK3(){
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: {
            typecontrol_ids: this.typecontrol_id
          },
        });
        if(result.status==200){
          this.second_levelFn()
          this.Typecontrol()
          this.centerdeleteDialogVisible2=false
        }
        
      } catch (error) {
        console.error(error);
      }
  
    },
    //确认删除
    async removeHandlerOK4(){
      try {
        let result = await this.$api({
          type: "deleteTypecontrol",
          data: {
            typecontrol_ids: this.typecontrol_id
          },
        });
        if(result.status==200){
          this.three_levelFn()
          this.Typecontrol()
          this.centerdeleteDialogVisible3=false
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