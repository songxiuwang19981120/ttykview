<template>
    <div class="table-footer">
      <!-- <div v-if="meta.total_items" class="dataTables_info">Showing {{ meta.total_items ? meta.start_index + 1 : 0 }} to {{ meta.end_index + 1 }} of {{ meta.total_items }}</div> -->
      <div v-if="meta.total_items" class="dataTables_info">共 {{ meta.total_pages }}页/{{ meta.total_items }}条数据</div>
      <div v-if="meta.total_items" class="paginating-container pagination-solid align-items-right">
        <b-pagination
          v-model="table_option.current_page"
          :total-rows="table_option.total_rows"
          :per-page="table_option.page_size"
          prev-text="Prev"
          next-text="Next"
          first-text="First"
          last-text="Last"
          first-class="first"
          prev-class="prev"
          next-class="next"
          last-class="last"
          class="rounded"
          @change="onPageChange"
        >
          <template #first-text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </template>
          <template #prev-text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </template>
          <template #next-text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </template>
          <template #last-text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </template>
        </b-pagination>
        <div class="page_jump">
          跳转至第 <b-input class="page-input mx-1" type="number" min="1" v-model="jumpPage" @change="onJumpPageChange" /> 页
          <b-button class="jump-btn ml-1" @click="jumpTo">确定</b-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // import { tableCommon } from '@/mixins/tableCommon.js';
  export default {
    name: 'pagination',
    // mixins: [tableCommon],
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    props: {
      // table_option: {
      //   type: Object,
      //   default() {
      //     return {
      //       total_rows: 0,
      //       current_page: 1,
      //       page_size: 10,
      //     };
      //   },
      // },
      // meta: {
      //   type: Object,
      //   default() {
      //     return {};
      //   },
      // },
      total: {
        type: Number,
        default() {
          return 0;
        },
      },
      current: {
        type: [Number, String],
        default() {
          return 1;
        },
      },
      page_size: {
        type: Number,
        default() {
          return 10;
        },
      },
    },
    data() {
      return {
        table_option: {
          total_rows: 0,
          current_page: 1,
          page_size: 10,
        },
        meta: {},
        jumpPage: 1,
      };
    },
    watch: {
      total: {
        handler: function (val) {
          // console.log(val);
          this.table_option.total_rows = val;
        },
        immediate: true,
      },
      current: {
        handler: function (val) {
          // console.log(val);
          this.table_option.current_page = val;
          this.jumpPage = val;
        },
        // immediate: true,
      },
      page_size: {
        handler: function (val) {
          // console.log(val);
          this.table_option.page_size = val;
        },
        // immediate: true,
      },
      table_option: {
        handler: function () {
          this.get_meta();
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      get_meta() {
        // console.log(this.table_option);
        this.meta = this.get_common_meta(this.table_option);
      },
      get_common_meta(table_option) {
        var startPage;
        var endPage;
        var totalPages = table_option.page_size < 1 ? 1 : Math.ceil(table_option.total_rows / table_option.page_size);
        totalPages = Math.max(totalPages || 0, 1);
  
        var maxSize = 5;
        var isMaxSized = typeof maxSize !== 'undefined' && maxSize < totalPages;
        if (isMaxSized) {
          startPage = Math.max(table_option.current_page - Math.floor(maxSize / 2), 1);
          endPage = startPage + maxSize - 1;
  
          if (endPage > totalPages) {
            endPage = totalPages;
            startPage = endPage - maxSize + 1;
          }
        } else {
          startPage = 1;
          endPage = totalPages;
        }
        let startIndex = (table_option.current_page - 1) * table_option.page_size;
        let endIndex = Math.min(startIndex + table_option.page_size - 1, table_option.total_rows - 1);
  
        var pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);
        return {
          total_items: table_option.total_rows,
          current_page: table_option.current_page,
          page_size: table_option.page_size,
          total_pages: totalPages,
          start_page: startPage,
          end_page: endPage,
          start_index: startIndex,
          end_index: endIndex,
          pages: pages,
        };
      },
      /**
       * 翻页回调
       */
      onPageChange(page) {
        this.table_option.current_page = page;
        this.$emit('change', page);
      },
      /**
       * 跳转回调
       */
      onJumpPageChange(page) {
        // console.log(page);
        this.jumpPage = page < 1 ? 1 : page > this.meta.total_pages ? this.meta.total_pages : page;
      },
      /**
       * 点击跳转
       */
      jumpTo() {
        this.$emit('change', this.jumpPage);
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import '@/assets/base/base.scss';
  $rate: 0.64;
  $xPercent: percentage(0.24);
  .dataTables_info {
    font-size: 9px;
    color: $placeholder-color;
  }
  ::v-deep .paginating-container {
    align-items: center;
    .pagination {
      transform: scale($rate) translateX($xPercent);
    }
    .rounded li {
      // width: 24px;
      // height: 24px;
      border-radius: 1px;
      background-color: #e0e6ed;
      // font-size: 9px;
  
      &:not(:last-child) {
        margin-right: 4px / $rate;
      }
      &.active {
        background-color: $primary-color !important;
      }
      &.disabled {
        background-color: #f2f5f9 !important;
      }
      svg {
        color: #6c757d;
      }
    }
    .page_jump {
      display: flex;
      align-items: center;
      font-size: 9px;
      color: $placeholder-color;
      .page-input {
        display: inline-block;
        width: 44px;
        height: 24px;
        padding: 0 0 0 8px;
        border-radius: 2px;
        font-size: 9px;
      }
      .jump-btn {
        width: 40px;
        height: 24px;
        padding: 0;
        border: none;
        border-radius: 1px;
        font-size: 9px;
        background-color: $primary-color;
      }
    }
  }
  </style>