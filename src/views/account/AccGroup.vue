<template>
  <div>
      账号分组
        <!-- 表格 -->
    <tableCustom height="600" :tableData="tableData" :columns="columns" :mutiSelect="true"  @handleSelectionChange="selectionChange" :loading="loading">
    </tableCustom>

    <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
    </pagination>

    <el-dialog
  :visible.sync="supplement"
  width="30%"
  :before-close="supplementClose">
  <div>补充账号:<el-input style="width:200px" size="mini" v-model="supplementinput"></el-input></div>
  <div>一键删除被封账号:<el-switch
  v-model="supplementdelete"
  active-color="#13ce66"
  >
</el-switch></div>
 


  <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="supplement = false">取 消</el-button>
    <el-button size="medium" type="primary" @click="supplement = false">确 定</el-button>
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
        supplementdelete:true,
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
                <el-button size="mini" type="danger" onClick={this.handleDelete.bind(this, row)}>删除</el-button>
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
  //选中的数据
    selectionChange(val) {
      console.log(val)
    },
    //管理
    handleEdit(row){
      console.log(row)
      this.supplement=true
    },
    //关闭弹窗清空
    supplementClose(){
      this.supplementinput=""
    },
    //删除
    handleDelete(row){
    console.log(row);
    },
    
    //翻页回调

    handlePagination(val) {
      this.current_page = val.page; //页数
      this.current_limit = val.limit; //条数
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>