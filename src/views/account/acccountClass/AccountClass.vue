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

          <el-select :disabled="disabledacc.first_level" v-model="formNew.first_level" placeholder="一级" ref="template"
            @change="first_levelFn" @visible-change="(v) => visibleChange(v, 'template')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in options_tw" :key="item.typecontrol_id" :label="item.label" :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>

            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.second_level" v-model="formNew.second_level" placeholder="二级"
            ref="template1" @change="second_levelFn" @visible-change="(v) => visibleChange1(v, 'template1')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in searchEquipmentList_second_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>


            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.three_level" v-model="formNew.three_level" placeholder="三级" ref="template2"
            @change="three_levelFn" @visible-change="(v) => visibleChange2(v, 'template2')"
            style="width:120px;margin-right: 10px;">
            <el-option v-for="item in searchEquipmentList_three_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>


            </el-option>
          </el-select>


          <el-select :disabled="disabledacc.four_level" v-model="formNew.four_level" placeholder="四级" ref="template3"
            @change="four_levelFn" @visible-change="(v) => visibleChange3(v, 'template3')" style="width:120px">
            <el-option v-for="item in searchEquipmentList_four_level" :key="item.typecontrol_id" :label="item.label"
              :value="item.value">
              <span style="float: left" class="span-style">{{ item.label }}</span>


            </el-option>
          </el-select>



        </el-form-item>
        <el-form-item label="新增分类展示:" prop="name">
          <el-input :disabled="disabled_name" v-model="formNew.name" style="width:200px"
            placeholder="新增分类展示"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeadd">取 消</el-button>
        <el-button type="primary" @click="addSubject" :loading="submitting">{{
          submitting? '提交中 ...': '确定'}}</el-button>
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
          this.formNew.equipment = result.data.grouping_id
          this.options = result.data;
          this.filterTreeDate(result.data)
        }//联动后方无内容
      } catch (error) {
        console.error(error)
      }
    },
    //分类
    async getEquipmentGroupAdd() {
      this.formNew.first_level = ""
      this.disabledacc = {
        first_level: true,//一级分类
        second_level: true,//二级分类
        three_level: true,
        four_level: true,
      };
      this.formNew.name = ""
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
          this.disabledacc.first_level = false
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
      this.searchEquipmentList_second_level = []
      this.searchEquipmentList_three_level = []
      this.searchEquipmentList_four_level = []
      this.disabledacc.second_level = false;
      this.disabledacc.three_level = true;
      this.disabledacc.four_level = true;
      this.formNew.name = ""
      this.formNew.firstch = ""
      this.formNew.secch = ""
      this.formNew.threech = ""
      this.formNew.fourch = ""
      this.formNew.second_level = ""
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      if (val) {
        this.options_tw.forEach(item => {
          if (item.value == val) {
            this.formNew.firstch = item.label
            this.formNew.name = this.formNew.firstch + this.formNew.secch + this.formNew.threech + this.formNew.fourch
          }
        });
        try {
          let result = await this.$api({
            type: "getTypecontrol",
          });
          if (result.status == 200) {
            result.data.forEach(item => {
              if (item.value == val) {
                item.children.forEach(element => {
                  _self.searchEquipmentList_second_level.push(element)
                  console.log(_self.searchEquipmentList_second_level)
                });

              }
            });
            console.log(this.searchEquipmentList_second_level, "二级分类数据")
          } else {
            this.$message.error(res.msg);
            _self.searchEquipmentList_second_level = []
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    //第二个下拉分类change事件
    second_levelFn(val) {
      let _self = this
      this.searchEquipmentList_three_level = []
      this.searchEquipmentList_four_level = []
      this.disabledacc.three_level = false;
      this.disabledacc.four_level = true;
      this.formNew.name = ""
      this.formNew.secch = ""
      this.formNew.threech = ""
      this.formNew.fourch = ""
      this.formNew.three_level = ""
      this.formNew.four_level = ""
      if (val) {
        this.searchEquipmentList_second_level.forEach(item => {
          if (item.value == val) {
            this.formNew.secch = item.label
            this.formNew.name = this.formNew.firstch + "/" + this.formNew.secch + this.formNew.threech + this.formNew.fourch
          }
        });
        this.searchEquipmentList_second_level.forEach(item => {
          if (item.value == val) {
            item.children.forEach(element => {
              _self.searchEquipmentList_three_level.push(element)
              console.log(_self.searchEquipmentList_three_level)
            });

          }
        });
      }
    },
    //第三个下拉分类change事件
    three_levelFn(val) {
      let _self = this
      this.searchEquipmentList_four_level = []
      this.disabledacc.four_level = false;
      this.formNew.name = ""
      this.formNew.threech = ""
      this.formNew.fourch = ""
      this.formNew.four_level = ""
      if (val) {
        this.searchEquipmentList_three_level.forEach(item => {
          if (item.value == val) {
            this.formNew.threech = item.label
            this.formNew.name = this.formNew.firstch + "/" + this.formNew.secch + "/"+this.formNew.threech + this.formNew.fourch
          }
        });
        this.searchEquipmentList_three_level.forEach(item => {
          if (item.value == val) {
            item.children.forEach(element => {
              _self.searchEquipmentList_four_level.push(element)
              console.log(_self.searchEquipmentList_four_level)
            });

          }
        });
      }
    },
    //第四个个下拉分类change事件
    four_levelFn(val) {
      this.formNew.name = ""
      this.formNew.fourch = ""
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

      this.Typecontrol()
    },

    //新增按钮打开
    dialogNewVisibleadd() {
      this.dialogNewVisible = true;
    },
    //是否根目录
    // addlis() {
    //   if (this.checked == true) {
    //     this.formNew.group = "";
    //     this.rules.group= [{ required: true, message: '请选择账号分类', trigger: 'blur' }]
    //     this.disabled = false;
    //     this.pid = 0
    //   } else {
    //     this.rules.group=[]
    //     this.disabled = true;
    //   }
    // },
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
        this.submitting = true
        this.options_tw.forEach(item => {
        
          if (item.value == item.label) {
            this.pid = 0
            this.formNew.name = this.formNew.first_level
            this.loading = true;
            this.TypecontrolAdd()
            //这边暂时先这样,需要改
            setTimeout(() => {
              //第二个提交
              this.TypecontrolAddd()
            }, 1000);
            setTimeout(() => {
              //第三个提交
              this.TypecontrolAdddd()
            }, 2000);
            setTimeout(() => {
              //第四个提交
              this.TypecontrolAddddd()
            }, 3000);
          } else if (item.value == this.formNew.first_level) {
            this.pidd = item.typecontrol_id
            this.TypecontrolAddd()
            setTimeout(() => {
              //第三个提交
              this.TypecontrolAdddd()
            }, 1000);
            setTimeout(() => {
              //第四个提交
              this.TypecontrolAddddd()
            }, 2000);
          } else if (item.value == this.formNew.second_level) {
            this.pidd = item.typecontrol_id
            this.TypecontrolAdddd()
            setTimeout(() => {
              //第四个提交
              this.TypecontrolAddddd()
            }, 1000);
          } else if (item.value == this.formNew.three_level) {
            this.pidd = item.typecontrol_id
            this.TypecontrolAddddd()
          }

          setTimeout(() => {
            this.submitting = false
          }, 3000);
        });
              
      });
  

  
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

        if (result.status == '200') {
          this.Typecontrol()
          this.$message.success('新增成功');
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
            type_title: this.formNew.secch,
            pid: this.pidd,
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
    async TypecontrolAdddd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.threech,
            pid: this.pidd,
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
    async TypecontrolAddddd() {
      try {
        let result = await this.$api({
          type: "addTypecontrol",
          data: {
            type_title: this.formNew.fourch,
            pid: this.pidd,
            grouping_id: this.formNew.equipment
          },
        });

        if (result.status == '200') {
          this.Typecontrol()
          this.pidd = result.data
          this.closeadd()//最后一个函数放

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
      this.rules.group = [{ required: true, message: '请选择账号分类', trigger: 'blur' }]
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
        this.options_tw.push({ typecontrol_id: value, label: value, value: value })
        this.formNew.first_level = value
        this.first_levelFn(value)
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


    // 下拉添加分类按钮1
    showShipTemplate1() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        this.searchEquipmentList_second_level.push({ typecontrol_id: value, label: value, value: value })
        this.formNew.second_level = value
        this.second_levelFn(value)

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


    // 下拉添加分类按钮2
    showShipTemplate2() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        this.searchEquipmentList_three_level.push({ typecontrol_id: value, label: value, value: value })
        this.formNew.three_level = value
        this.three_levelFn(value)

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


    // 下拉添加分类按钮3
    showShipTemplate3() {
      this.$prompt("请输入新的分类名称", "新增分类", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        this.searchEquipmentList_four_level.push({ typecontrol_id: value, label: value, value: value })
        this.formNew.four_level = value
        this.four_levelFn(value)

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



  },
};
</script>

<style scoped>

</style>