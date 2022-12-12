<template>
  <div>
    <div style="background-color:white;padding:10px">
      <span style="margin-right:10px">设备分组选择:</span>
      <el-cascader v-model="value" :options="options" :props="{ checkStrictly: true }"
        @change="handleChange"></el-cascader>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData1" style="width: 100%" row-key="id" lazy :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="date" label="编号" align="center" width="300">
      </el-table-column>
      <el-table-column prop="name" label="名称" align="center">
      </el-table-column>
      <el-table-column prop="address" width="180" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination style="" :total="total" :page="page" :limit="10" :size="limit" @pagination="handlePagination">
    </pagination>
  </div>
</template>

<script>
import pagination from '@/components/myComponent/table/pagination.vue';
export default {

  name: 'AccountClass',
  components: { pagination },
  data() {
    return {
      total: 100,  //数据总量
      page: 1, //当前页
      limit: 10, //每页条数
      value: [],//联动绑定数据
      value2:[],
      options: [],//联动数据
      //表格数据
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        buttonShow: true,
        hasChildren: true,
        children: [{
          id: 31,
          date: 'g国家',
          hasChildren: true,
          children: [{
            id: 32,
            date: '项目',
            hasChildren: true,
            children: [{
              id: 33,
              date: '一级分类',
              hasChildren: true,
              children: [{
                id: 34,
                date: '二级分类',
              }]
            }]
          }]
        }]

      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小',
        address: '上海市普陀区金沙江路 1517 弄',
        buttonShow: true,
        hasChildren: true,
        buttonShow: true, children: [{
          id: 41,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          hasChildren: true,
        }]

      }, {
        id: 3,
        date: '2016-05-01',
        name: '小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true,
        buttonShow: true, children: [{
          id: 51,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          hasChildren: true,
        }]

      }, {
        id: 4,
        date: '2016-05-03',
        name: '王虎',
        address: '上海市普陀区金沙江路 1516 弄',
        hasChildren: true,
        buttonShow: true, children: [{
          id: 61,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          hasChildren: true,
        }]
      }]
    }
  },
  mounted() {
    this.Typecontrol();//联动数据


  },

  methods: {

    //四级联动点完后的事件
    handleChange(value) {
       this.value2=value[value.length - 1] ?? '';
      
    },
    //undefind联动
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
        let result = await this.$api({ type: "getTypecontrol" });
        
        this.options = result;
        this.filterTreeDate(result)
      } catch (error) {
        console.error(error)
      }
    },
    //操作
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);

    },
    //表格树形
    load(tree, treeNode, resolve) {
      console.log(tree)
      setTimeout(() => {
        resolve(tree.children)
      }, 100)
    },
    /**
 * 翻页回调
 */

    async handlePagination(val) {
      try {
        console.log(val)
        this.page = val.page;
        this.limit = val.limit
        let result = await this.$api({
          type: "getTypecontrol",
          data: { page: this.page },
        });
        console.log(result)

      } catch (error) {
        console.error(error);
      }
    },

    // //列表数据接口
    // async viewTypecontrol() {
    //   let data = {
    //     typecontrol_id: this.value2,
    //   };
    //     let result = await this.$api({
    //       type: "viewTypecontrol",data:data});
    //     console.log(result)
    // },
  },
};
</script>

<style lang="stylus" scoped>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>