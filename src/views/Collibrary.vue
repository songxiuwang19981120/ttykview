<template>
  <div>
    <div style="margin-bottom:10px">
      <!-- 目标国家 -->
      <el-select v-model="state" placeholder="目标国家" size="mini">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- 使用状态 -->
      <el-select style="margin-left:10px" v-model="use" placeholder="使用状态" size="mini">
        <el-option
          v-for="item in useOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- 日期选择 -->
      <el-date-picker
      value-format="timestamp"
      style="margin-left:10px;"
      size="mini"
        v-model="dateSelect"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateSelectFn">
      </el-date-picker>
      <!-- 批量删除 -->
      <el-popconfirm
      style="margin-left:10px"
        title="确定删除？"
        @confirm="deleteColi"
      >
        <el-button  size="mini" type="danger" slot="reference">批量删除</el-button>
      </el-popconfirm>
    </div>
    <!-- 表格 -->
    <tableCustom 
    height="600" 
    :tableData="tableData" 
    :columns="columns" 
    :mutiSelect="true" 
    @handleSelectionChange="selectionChange" 
    :loading="loading">
   </tableCustom>
    <!-- 分页 -->
    <pagination 
    :total="total" 
    :page="current_page" 
    :limit="current_limit" 
    @pagination="handlePagination">
  </pagination>
  </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
  components: { pagination, tableCustom },
  name: 'Collibrary',

  data() {
      return {
        state:"",//国家
        use:"",//状态
        dateSelect:"",//日期
        loading:false,
        selectionVal:"",
        tableData: [
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '正常',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '空白号',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '封号',
        },        
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '限制私信',
        },
        {
          a: '1',
          b: '1',
          c: '1',
          d: '1',
          e: '1',
          f: '1',
          g: '1',
          h: '异常登录',
        },
      ],
      columns: [
        {
          prop: 'a',
          label: '用户昵称',
          align: 'center',

        },
        {
          prop: 'b',
          label: '用户ID',
          align: 'center',

        },
        {
          prop: 'c',
          label: '目标国家',
          align: 'center',

        },
        {
          prop: 'd',
          label: '使用状态',
          align: 'center',

        },
        {
          prop: 'e',
          label: '采集时间',
          align: 'center',

        },
        {
          prop: 'e',
          label: '使用时间',
          align: 'center',

        },
      ],
      total: 2,  //数据总量
      current_page: 1, //当前页
      current_limit: 10, //每页条数
      stateOptions:[
        { value: '选项1',
          label: '中国'},
        { value: '选项2',
          label: '美国'},
        { value: '选项3',
          label: '日本'},
      ],
      useOptions:[
        { value: '选项1',
          label: '已使用'},
        { value: '选项2',
          label: '未使用'},
        
      ]
      };
  },

  mounted() {
      
    
  },

  methods: {
    /* 
        function: selectionChange
        params: val | 默认参数
        desc: 表格多选框
    */
    selectionChange(val) {
      console.log(val)
      this.selectionVal=val
    },

    /* 
        function: dateSelectFn
        params: null
        desc: 日期选择
    */
    dateSelectFn() {
      console.log(this.dateSelect)
    },

    /* 
        function: deleteColi
        params: null
        desc: 批量删除
    */
    deleteColi() {
      if(this.selectionVal){
        console.log(this.selectionVal)
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