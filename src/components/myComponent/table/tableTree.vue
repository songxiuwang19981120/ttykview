<template>
    <el-table
      ref="tableTree"
      highlight-current-row
      row-key="id"
      v-loading="loading"
      :data="tableData"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.id"
        :label="column.label"
        :fixed="column.fixed"
        :prop="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        :class-name="column.classname"
      >
        <template slot-scope="scope">
          <table-render v-if="column.render" :row="scope.row" :render="column.render"></table-render>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </template>
  
  <script>
  import tableRender from './tableRender.vue';
  export default {
    name: 'TtTableTree',
    components: {
      tableRender,
    },
    data() {
      return {};
    },
    props: {
      loading: Boolean,
      // 表格数据
      tableData: {
        type: Array,
        default() {
          return [];
        },
      },
      // 表格字段
      columns: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
  </script>
  