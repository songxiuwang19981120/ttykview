<template>
  <div>
      <div style="margin-bottom:10px">

        <el-popconfirm
        title="确定删除？"
        @confirm="batchDelete"
      >
        <el-button  size="mini" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
        
      </div>
    <!-- 表格 -->
    <tableCustom height="600" :tableData="tableData" :columns="columns" :mutiSelect="true"  @handleSelectionChange="selectionChange" :loading="loading"></tableCustom>

    <!-- 分页 -->
    <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>

  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';

export default {
  components: { pagination, tableCustom },
  name: 'Tasklog',

  data() {
      return {
        stop:false,
        loading:false,
        deleteGroupingId:"",
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
          h: '0',
        }
      ],
        columns: [
        {
          prop: 'a',
          label: '任务类型',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: 'b',
          label: '任务状态',
          align: 'center',
          minWidth:"50"
        },
        {
          prop: 'c',
          label: '任务名称',
          align: 'center',
          minWidth:"50"

        },
        {
          prop: 'd',
          label: '更新时间',
          align: 'center',
          minWidth:"100"

        },
        {
          prop: 'e',
          label: '创建时间',
          align: 'center',
          minWidth:"100"
        },
        {
          prop: "g",
          label: '操作',
          align: 'center',
          minWidth: "100",
          render: (h, { row }) => {
            return (
              <div>
                <el-button size="mini" type="primary" onClick={this.update.bind(this, row)}>更新</el-button>
                <el-button size="mini" type="warning" onClick={this.suspend.bind(this, row)}>{ row.h ? "开始" : "暂停" }</el-button>
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
        total: 2,  //数据总量
        current_page: 1, //当前页
        current_limit: 10, //每页条数
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
      this.deleteGroupingId=""
      val.forEach(element => {
        this.deleteGroupingId= this.deleteGroupingId+element.a+","
      });
      console.log(this.deleteGroupingId)
    },

    /* 
        function: update
        params: row | 默认参数
        desc: 更新按钮
    */
    update(row) {
      console.log(row)
    },

    /* 
        function: suspend
        params: row | 默认参数
        desc: 暂停按钮
    */
    suspend(row) {
      row.h=!row.h
    },

    /* 
        function: handleDelete
        params: row | 默认参数
        desc: 删除按钮
    */
    handleDelete(row) {
      console.log(row)
    },

    /* 
        function: batchDelete
        params:null
        desc: 批量删除
    */
    batchDelete() {
      if(this.deleteGroupingId){
        console.log(this.deleteGroupingId)
        this.$message.success("删除成功")
      }else{
        this.$message.error("请选择需要删除的内容")
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