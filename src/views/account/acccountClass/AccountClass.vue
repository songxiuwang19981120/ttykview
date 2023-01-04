<template>
  <div class="AccountClass">
    <div style="padding:10px">

      <el-select v-model="searchTableData.equipment" placeholder="账号分组选择" style="margin-right: 20px"
        @change="getTypecontrol"
        :loading="equipmentLoading" loading-text="数据加载中...">
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
        <el-form-item label="选择账号分类:" prop="group">
          <!-- <el-cascader  :options="options_tw"  v-model="formNew.group"
            @change="menuchange" style="width:200px">
            <template slot-scope="{ node, data }">
              <span>
                <span>{{ data.label }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </span>
            </template>
          </el-cascader>
          <span @click="addlis">
            <el-checkbox style="margin-left:20px" v-model="checked">添加为一级分类</el-checkbox>
          </span> -->

          <el-select
          :disabled="disabledacc.first_level"
            v-model="formNew.first_level"
            placeholder="一级"
            ref="template"
            @change="second_levelFn"
            @visible-change="(v) => visibleChange(v, 'template')"
            style="width:120px;margin-right: 10px;"
          >
            <el-option
              v-for="item in options_tw"
              :key="item.typecontrol_id"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left" class="span-style">{{ item.label }}</span>
          
            </el-option>
          </el-select>


          <el-select
          :disabled="disabledacc.second_level"
            v-model="formNew.second_level"
            placeholder="二级"
            ref="template1"
            @visible-change="(v) => visibleChange(v, 'template1')"
            style="width:120px;margin-right: 10px;"
          >
            <el-option
              v-for="item in searchEquipmentList_second_level"
              :key="item.grouping_id"
              :label="item.grouping_name"
              :value="item.grouping_id"
            >
              <span style="float: left" class="span-style">{{ item.grouping_name }}</span>
          

            </el-option>
          </el-select>


          <el-select
          :disabled="disabledacc.three_level"
            v-model="formNew.three_level"
            placeholder="三级"
            ref="template2"
            @visible-change="(v) => visibleChange(v, 'template2')"
            style="width:120px;margin-right: 10px;"
          >
            <el-option
              v-for="item in searchEquipmentList"
              :key="item.grouping_id"
              :label="item.grouping_name"
              :value="item.grouping_id"
            >
              <span style="float: left" class="span-style">{{ item.grouping_name }}</span>
          

            </el-option>
          </el-select>


          <el-select
          :disabled="disabledacc.four_level"
            v-model="formNew.four_level"
            placeholder="四级"
            ref="template3"
            @visible-change="(v) => visibleChange(v, 'template3')"
            style="width:120px"
          >
            <el-option
              v-for="item in searchEquipmentList"
              :key="item.grouping_id"
              :label="item.grouping_name"
              :value="item.grouping_id"
            >
              <span style="float: left" class="span-style">{{ item.grouping_name }}</span>
          

            </el-option>
          </el-select>



        </el-form-item>
        <el-form-item label="新增分类名称:" prop="name">
          <el-input v-model="formNew.name" style="width:200px" placeholder="新增分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeadd">取 消</el-button>
        <el-button type="primary" @click="addSubject" :loading="submitting">{{ submitting ? '提交中 ...' : '确 定'}}</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <tableCustom height="600" :tableData="tableData_tw_t" row-key="value" :columns="columns" :load="load" :loading="loading">
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
      options_tww:[],//第一级下拉
      loading:false,
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
        name: '',
        first_level:"",//一级分类
        second_level:"",//二级分类
        three_level:"",
        four_level:"",
      },//新增分组名称
      options_tw: [],
      //下拉是否显示
      disabledacc:{
        first_level:true,//一级分类
        second_level:true,//二级分类
        three_level:true,
        four_level:true,
      },
      //下拉数据
      searchEquipmentList_second_level:[],
    }
  },
  mounted() {
    this.Typecontrol();//联动数据
    this.getEquipmentGroup();
  },

  methods: {
    /*
          翻页回调
       */
    handlePagination(val) {
      this.current_page = val.page;  //页数
      this.current_limit = val.limit  //条数
      this.Typecontrol()
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
          this.options = result.data;
          this.filterTreeDate(result.data)
        }//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },
    //分类
    async getEquipmentGroupAdd() {
      this.formNew.first_level=""
      this. disabledacc={
        first_level:true,//一级分类
        second_level:true,//二级分类
        three_level:true,
        four_level:true,
      };
      try {
        let result = await this.$api({
          type: "getTypecontrol",
          data: {
            grouping_id:this.formNew.equipment
          }
        });
        if (result.status == 200) {
          this.options_tw = result.data;
          console.log(this.options_tw,"123")
          this.disabledacc.first_level=false
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
    //第一个下拉分类
    second_levelFn(val){
    console.log(val)
    if(this.formNew.first_level){
      console.log(this.formNew.first_level)
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
      this.searchTableData.equipment=""
      this.val_Tw = "";
      this.options = [];

      this.Typecontrol()
    },

    //新增按钮打开
    dialogNewVisibleadd() {
      this.dialogNewVisible = true;
    },
    //是否根目录
    addlis() {
      if (this.checked == true) {
        this.formNew.group = "";
        this.rules.group= [{ required: true, message: '请选择账号分类', trigger: 'blur' }]
        this.disabled = false;
        this.pid = 0
      } else {
        this.rules.group=[]
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
      this.vals = this.getCascaderObj(this.formNew.group, this.menudata); //选中节点数据
      this.vals_tree_t = [];
      this.vals_tree_t.push(this.vals[this.vals.length - 1])
      this.pid = this.vals_tree_t[0].typecontrol_id
    },
    addSubject() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false;
        if (this.pid != '' || this.pid == 0) {
          this.submitting = true;
          this.TypecontrolAdd()
        }
        else {
          return this.$message.warning('请选择账号分类');
        }
      })
    },
    //新增按钮确认
    async TypecontrolAdd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.name,
            pid: this.pid,
            grouping_id: this.formNew.equipment
          },
        });
        this.submitting = false;
        if (result.status == '200') {
          this.Typecontrol()
          this.$message.success('新增成功');
          this.closeadd()
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
      this.rules.group= [{ required: true, message: '请选择账号分类', trigger: 'blur' }]
      this.options_tw = []
      this.dialogNewVisible = false
      this.checked = false;
      this.disabled = false;
      this.formNew.equipment = ""
      this.formNew.group = ""
      this.formNew.name = ""
      this.pid = ""
      this.formNew.first_level=""
      this.formNew.second_level=""
      this.formNew.three_level=""
      this.formNew.four_level=""
      this. disabledacc={
        first_level:true,//一级分类
        second_level:true,//二级分类
        three_level:true,
        four_level:true,
      }
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
      this.tableData_tw_t = [];
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
        this.loading=true
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
      }finally {
        this.loading=false
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


    // 下拉添加分类按钮
    showShipTemplate() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        console.log(value)
       
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



  },
};
</script>

<style scoped>

</style>