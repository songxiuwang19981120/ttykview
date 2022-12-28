<template>
  <div>
    <div class="tt-accsituation">
      <div class="tt-accsituation--operation">
        <div style="float:left">
          <span>显示分组：</span>
          <el-select v-model="equipment" placeholder="请选择分组" style="width:150px;">
            <el-option v-for="item in searchEquipentList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float:left;margin-left: 80px;">
          <span style="width:100px">显示状态：</span>
          <el-select v-model="equipmentState" placeholder="请选择状态" style="width:150px;">
            <el-option v-for="item in searchEquipentListState" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="float:left;margin-left: 80px;">
          <el-button type="primary" @click="dialog = true">修改分组</el-button>
          <el-drawer title="修改分组" :before-close="handleClose" :visible.sync="dialog" direction="rtl"
            custom-class="demo-drawer" ref="drawer">
            <div class="">
              <el-form :model="form">
                <el-form-item label="修改分组" :label-width="formLabelWidth">
                  <el-select v-model="form.region" placeholder="请选择分组">
                    <el-option v-for="item in searchEquipentList" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <!-- 更改显示状态的列表 -->
              <table-custom :loading="loading" :tableData="tableData2" :columns="columns_T"></table-custom>
              <div style="float: right;margin-right: 20px;margin-top: 20px;">
                <el-button @click="cancelForm">关 闭</el-button>
                <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading
                    ?
                    '提交中 ...' : '确 定'
                }}</el-button>
              </div>
            </div>
          </el-drawer>

        </div>
        <div style="float:left;">
          <el-button style="margin-left: 20px;" type="primary" @click="dialogFormVisible = true">创建账号</el-button>
          <el-dialog title="创建账号" style="width:50%; margin:0 auto" :visible.sync="dialogFormVisible"
            :before-close="handleCloseDialog">
            <!-- 四级联动 -->
          
            
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item label="选择分组:" :disabled="false" prop="equipment" label-width="100px">
                <el-select :disabled="disabled" v-model="ruleForm.equipment" placeholder="账号分组选择" style="margin-right: 10px"
                  @focus="getaccGroup" :loading="equipmentLoading" loading-text="数据加载中...">
                  <el-option v-for="item in searchEquipmentList" :key="item.grouping_id"
                    :label="item.grouping_name" :value="item.grouping_id">
                  </el-option>
                </el-select>
                <span @click="addlis()">
            <el-checkbox  v-model="checked">选择全部分组</el-checkbox>
          </span>
              </el-form-item>

              <el-form-item label="选择分类:" prop="classify" label-width="100px">
                <el-cascader v-model="ruleForm.classify" :options="options" @change="handleChange">
                </el-cascader>
              </el-form-item>

            
              <el-form-item label="最大容量:" label-width="100px">
                <!-- 计数器 -->
                <el-input-number v-model="ruleForm.num" @change="handleChangeNum" :min="1" :max="10"
                  label="请输入单设备最大容量"></el-input-number>
              </el-form-item>
            </el-form>
            <div slot="footer" style="margin-top: 100px;">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div style="clear: both;"></div>
      </div>
    </div>
    <table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
      @handleSelectionChange="selectionChange"></table-custom>
    <pagination :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination">
    </pagination>

  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
  name: 'EquipmentSituation',
  components: {
    tableCustom,
    pagination,
  },
  data() {
    return {
      checked: false,//是否添加根目录分组
      disabled:false,
      //联级选择器
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      searchEquipmentList:[],
      equipmentLoading:false,
      //计数器
      visibleDelete: false,
      dialog: false,//抽屉1显隐
      loading: false,//关闭等待
      form: {
        region: '',
      },//抽屉
      dialogFormVisible: false,
      ruleForm: {
        classify: [],
        num: '',
        equipment:[]
      },
      rules: {
        classify: [
          { required: true, message: '请选择分类', trigger: 'blur' },
        ],
        equipment: [
          { required: true, message: '请选择分组', trigger: 'blur' },
        ],
      },//弹框
      formLabelWidth: '80px',//宽
      timer: null,//定时器
      equipment: "",//显示分组
      searchEquipentList: [
        { value: "1", label: "供应商A" },
        { value: "2", label: "供应商B" },
        { value: "3", label: "供应商C" },
        { value: "4", label: "供应商D" },
      ],//分组数据
      equipmentState: "",//显示状态
      searchEquipentListState: [
        { value: "1", label: "正常" },
        { value: "2", label: "异常" },
      ],//状态数据
      //表格的
      loading: false, //表格加载loading
      tableData: [
        { num: "123", ch: "中国", stat: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", gross: "200", abnor: "123", tateKey: "123" },
        { num: "123", ch: "中国", stat: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", gross: "200", abnor: "123", tateKey: "123" },
        { num: "123", ch: "中国", stat: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", gross: "200", abnor: "123", tateKey: "123" },],  //表格数据
      columns: [
        {

          prop: 'num',
          label: '设备编号',
          fiexd: true,
          align: 'center',
        },
        {
          prop: 'ch',
          label: '账号分组',
          fiexd: true,
          align: 'center',
        },
        {
          prop: 'stat',
          label: '设备状态',
          fiexd: true,
          align: 'center',
        },
        {
          prop: 'gross',
          label: '账号总量',
          fiexd: true,
          align: 'center',
        },
        {
          prop: 'abnor',
          label: '异常账号数量',
          fiexd: true,
          align: 'center',
        },
        {
          prop: 'abnor',
          label: '账号管理',
          width: 400,
          fiexd: true,
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <el-popconfirm
                  confirm-button-text='删除'
                  cancel-button-text='取消'
                  title="确认清除此设备中异常账号？"
                  onConfirm={this.messageBox.bind(this, row)}
                >
                  <el-button slot="reference" type="danger" size="mini">删除异常账号</el-button>
                </el-popconfirm>

                <el-button style="margin-left:20px" type="primary" size="mini" onClick={this.examine.bind(this, row)}>查看详情</el-button>
              </div>
            );
          },
        },

      ],  //表格
      tableData2: [
      ],//抽屉中的数据
      columns_T: [{

        prop: 'num',
        label: '设备编号',
        fiexd: true,
        align: 'center',
      },
      {
        prop: 'ch',
        label: '账号分组',
        fiexd: true,
        align: 'center',
      },
      {
        prop: 'stat',
        label: '设备状态',
        fiexd: true,
        align: 'center',
      },],
      total: 100,  //数据总量
      current_page: 1, //当前页
      current_limit: 10, //每页条数
    };
  },

  mounted() {

  },

  methods: {
    // 获取账号分组数据
		async getaccGroup() {
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
        //是否根目录
        addlis() {
      this.ruleForm.equipment = [];
      if (this.checked == true) {
        this.disabled = false;
          this.rules. equipment=[
          { required: true, message: '请选择分组', trigger: 'blur' },
        ]
      } else {
        this.disabled = true;
        this.rules.equipment=[]
      
      }
    },
    //表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          alert('创建成功');
          this.ruleForm.classify = ""
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //计数器
    handleChangeNum(value) {
      console.log(value);
    },
    //联级选择器
    handleChange(value) {
      console.log(value);
    },
    //选择框选中
    selectionChange(val) {
      this.tableData2 = val
    },
    //确认删除
    messageBox() {
      console.log(123)
    },
    //查看详情
    examine() {
      console.log("查看详情")
      this.$router.push(
        {
          name: 'accsituation',
          params: {//路由传值
            id: '001',
            title: '消息00'
          },
        }
      )
    },
    //dialog弹出框
    handleCloseDialog(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //抽屉事件
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('确定要修改分组吗？')
        .then(_ => {
          console.log(this.form.region)//确认提交修改分组后的操作
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => { });
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    /**
               * 翻页回调
               */
    handlePagination(val) {
      this.current_page = val.page;  //页数
      this.current_limit = val.limit  //条数
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
  align-items: center;
  padding: 10px;
}
</style>