<template>
  <div>
    <div style="margin-bottom:10px"> 
      <el-button size="mini" type="primary" @click="establishGrouping=true">创建分组</el-button>
      <el-popconfirm
      style="margin-left:10px"
        title="确定删除？"
        @confirm="deleteGrouping"
      >
        <el-button  size="mini" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
   
    <!-- 表格 -->
    <tableCustom height="600" :tableData="tableData" :columns="columns" :mutiSelect="true"  @handleSelectionChange="selectionChange" :loading="loading"></tableCustom>

    <!-- 分页 -->
    <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>

    <!-- 管理弹窗 -->
    <el-dialog
      :visible.sync="supplement"
      width="20%"
      :before-close="supplementClose">
      <div>补充账号:<el-input style="width:200px" size="mini" v-model="supplementinput"></el-input></div>
        <div style="margin-top:20px">一键删除被封账号:
          <el-switch
            v-model="supplementdelete"
            active-color="#13ce66">
          </el-switch>
        </div>
    


      <span slot="footer" class="dialog-footer">
        <el-button size="mini"  type="primary" @click="supplementExecute">确认执行</el-button>
      </span>
    </el-dialog>

    <!-- 创建分组弹窗 -->
    <el-dialog
      :visible.sync="establishGrouping"
      width="30%"
      :before-close="establishGroupingClose">
      <div>
        <el-form :model="GroupingRuleForm" :rules="GroupingRules" ref="GroupingRules" label-width="100px">
          <el-form-item label="分组名称:" prop="GroupingName" >
            <el-input  style="width: 60%" size="mini" v-model="GroupingRuleForm.GroupingName"></el-input>
          </el-form-item>
          <el-form-item  label="添加账号:" prop="GroupingNum" >
            <el-input  style="width: 60%" size="mini" v-model="GroupingRuleForm.GroupingNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
				<el-button size="mini" 
        type="primary" 
         @click="SubmitGrouping">
         确认执行
        </el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
  
  name: 'AccountSituation',
  components: { pagination, tableCustom },
  data() {
      return {
        SubmitGroupingId:"",//多选框选中的ID
        GroupingRuleForm:{
          name:"",
          num:"",
        },
        GroupingRules:{
          GroupingName:[ { required: true, message: '请输入添加的分组名称', trigger: 'blur' },],
          GroupingNum:[ { required: true, message: '请输入添加的账号数量', trigger: 'blur' },],
        },
        establishGrouping:false,//创建分组弹窗
        supplementdelete:false,//是否一键删除被封
        supplementinput:"",//补充账号的model
        supplement:false,//管理弹窗
        total: 2,  //数据总量
        current_page: 1, //当前页
        current_limit: 10, //每页条数
        loading:false,
        tableData: [
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '1',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '2',
        }
      ],
        columns: [
        {
          prop: 'a',
          label: '分组名',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: 'b',
          label: '分组账号数',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: 'c',
          label: '正常账号',
          align: 'center',
          minWidth:"50"

        },
        {
          prop: 'd',
          label: '异常账号',
          align: 'center',
          minWidth:"50"

        },
        {
          prop: 'e',
          label: '更新时间',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: 'f',
          label: '创建时间',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: "g",
          label: '操作',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            return (
              <div>
                <el-button size="mini" type="primary" onClick={this.handleEdit.bind(this, row)}>管理</el-button>
                <el-popconfirm
                style="margin-left:10px"
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除？"
										onConfirm={this.handleDelete.bind(this, row, '1')}
									>
										<el-button slot="reference" type="danger" size="mini">
											删除
										</el-button>
									</el-popconfirm>
              </div>
            );
          },
        },
      ],
        
      };
  },

  mounted() {
      
  },

  methods: {

    /* 
        function: selectionChange
        params: val | 默认参数
        desc: 选中的数据
    */
    selectionChange(val) {
      this.SubmitGroupingId=""
      val.forEach(element => {
        this.SubmitGroupingId= this.SubmitGroupingId+element.a+","
      });
    },

    /* 
        function: handleEdit
        params: row | 默认参数
        desc: 管理按钮
    */
    handleEdit(row){
      console.log(row)
      this.supplement=true
    },

    /* 
        function: supplementClose
        params: null
        desc: 关闭管理弹窗清空
    */
    supplementClose(){
      this.supplementinput=""
      this.supplement=false
      this.supplementdelete=false
    },

    /* 
        function: supplementClose
        params: null
        desc: 管理弹窗确认执行按钮
    */
    supplementExecute(){
      //supplementinput补充账号的model  supplementdelete是否一键删除被封账号
      if(this.supplementinput || this.supplementdelete){
        console.log( this.supplementinput,this.supplementdelete)
        this.supplementClose()
        this.$message.success("执行成功")
      }else{
        this.$message.error("请选择要执行的操作")
      }
    },
    
    /* 
        function: handleDelete
        params: row | 默认参数
        desc: 删除按钮
    */
    handleDelete(row){
    console.log(row);
    },
    
    /* 
        function: establishGroupingClose
        params: null
        desc: 关闭创建分组弹窗beforecloase
    */
    establishGroupingClose(){
      this.establishGrouping=false
      this.$refs.GroupingRules.resetFields();
    },
        
    /* 
        function: SubmitGrouping
        params: null
        desc: 创建分组确认执行
    */
    SubmitGrouping(){
      this.$refs.GroupingRules.validate((valid) => {
          if (valid) {
            console.log(this.GroupingRuleForm.GroupingName,this.GroupingRuleForm.GroupingNum)
          this.establishGroupingClose()
          }else{
            return false
          }
        })
  },

    /* 
        function: batchDelete
        params: null
        desc: 批量删除
    */
    deleteGrouping(){
      if(this.SubmitGroupingId){
        console.log( this.SubmitGroupingId)
        this.$message.success("删除成功")
      }else{
        this.$message.error("请选择需要删除数据")
      }
     
  },
    






    /* 
        function: handlePagination
        params: val | 默认参数
        desc: 页面回调
    */
    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //条数
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>