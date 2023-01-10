<template>
    <div>
        <!-- 表格 -->
		<table-custom height="700" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
        <!-- 分页 -->
		<pagination :total="total" :page="current_page" :limit=" current_limit" @pagination="handlePagination"></pagination>
    </div>
  </template>
  
  <script>
  import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
  export default {
    
    name: 'NickMaterial',
    components: { pagination, tableCustom },
    data() {
        return {
            loading:false,
            tableData:[
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
                {
                    nickname: "Rejoicing",
                    usage_count: "1"
                },
            ],
            columns:[
            {
					prop: 'nickname',
					label: '昵称',
					align: 'center',
				},
				{
					prop: 'usage_count',
					label: '使用次数',
					align: 'center',
				}
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