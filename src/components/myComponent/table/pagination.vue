/**
 * 分页组件
 * @param currentPage 当前页
 * @param pageSize 当前页数据条数
 * @param total 总条数
 * 
 * @custom 自定义事件 handleSizeChange 当前页显示条数改变后的回调
 * @custom 自定义事件 handleCurrentChange 当前显示页码改变后的回调
 *  
 */

<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>


export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    // 移动端页码按钮的数量端默认值5
    pagerCount: {
      type: Number,
      default: document.body.clientWidth < 992 ? 5 : 7
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 当前页处于第几页
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    // 当前页条数
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    // el-pagination 组件自定义事件回调 参数val：当前页码一共多少条数据
    handleSizeChange(val) {
      // 触发父组件pagination自定义事件 传递当前页码数currentPage跟当前页显示多少条数limit
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    // el-pagination 组件自定义事件回调 参数val：当前页码处于第几页
    handleCurrentChange(val) {
      // 触发父组件pagination自定义事件 传递当前页码数currentPage跟当前页显示多少条数limit
      this.$emit('pagination', { page: val, limit: this.pageSize })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>

