<template>
    <el-table
      ref="tableCustom"
      highlight-current-row
      v-loading="loading"
      :row-key="rowKey"
      :data="tableData"
      :span-method="spanmethod"
      :cell-class-name="cellClassName"
      :header-cell-class-name="headerCellClassCame"
      :height="height"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @expand-change="expandChange"
      style="width: calc(100% - 32px); margin: 0 auto"
    >
      <el-table-column type="selection" width="36" :selectable="checkboxJudge" v-if="mutiSelect"></el-table-column>
      <el-table-column v-if="isExpand" width="24" type="expand">
        <template slot-scope="scope">
          <table-charts ref="tableChartsRef" :scope="scope.row"></table-charts>
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.id"
        :label="column.label"
        :sortable="column.sortable"
        :fixed="column.fixed"
        :prop="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        :class-name="column.classname"
        :align="column.align"
        :header-align="column.headerAlign"
        :render-header="renderHeader"
        :show-overflow-tooltip="column.tooltips"
      >
        <el-table-column
          v-for="child in column.children"
          :key="child.prop"
          :prop="child.prop"
          :label="child.label"
          :width="child.width"
          :min-width="child.minWidth"
          :class-name="child.classname"
          :show-overflow-tooltip="child.tooltips"
        >
          <template slot-scope="scope">
            <table-render v-if="child.render" :row="scope.row" :$index="scope.$index" :render="child.render"></table-render>
            <span v-else>{{ scope.row[child.prop] }}</span>
          </template>
        </el-table-column>
        <template v-if="!column.children" slot-scope="scope">
          <table-render v-if="column.render" :row="scope.row" :$index="scope.$index" :render="column.render"></table-render>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </template>
  
  <script>
  import tableRender from './tableRender.vue';
  export default {
    name: 'tableCustom',
    components: {
      tableRender,
    },
    data() {
      return {
        multipleSelection: [], //多行选中
      };
    },
    props: {
      height: {
        type: String,
      },
      loading: Boolean,
      // 主键值
      rowKey: {
        type: String,
        default() {
          return 'id';
        },
      },
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
      mutiSelect: {
        type: Boolean,
        default() {
          return false;
        },
      },
      isExpand: {
        type: Boolean,
        default() {
          return false;
        },
      },
      spanmethod: {},
      // rowclassname:{},
      cellClassName: {},
      headerCellClassCame: {},
    },
    watch: {
      columns: {
        immediate: true,
        handler(val) {
          this.columns = val;
        },
        deep: true,
      },
    },
    methods: {
      /**
       * 自定义头部
       */
      renderHeader(h, scope) {
        return <span class={scope.column.className}>{scope.column.label}</span>;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.$emit('handleSelectionChange', val);
      },
      handleSelect(selection, row) {
        this.$emit('handleSelect', { selection, row });
      },
      handleSelectAll(val) {
        this.$emit('handleSelectAll', val);
      },
      sortChange(column) {
        // console.log("sort change", column);
        this.$emit('sort-change', column);
      },
      // 监听展开，关闭行操作
      expandChange(row, expandedRows) {
        console.log(row, expandedRows);
      },
      /**
       * 判断checkbox是否可选
       * return false 禁用 true 可用
       */
      checkboxJudge(row) {
        // console.log(row, index);
        return row.readyState == 0 ? false : true;
      },
    },
  };
  </script>
  