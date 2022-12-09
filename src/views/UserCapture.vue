<template>
    <div>
        <table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
        <pagination :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination"></pagination>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'TtUserCapture',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            loading: false, //表格加载loading
            tableData: [],  //表格数据
            columns: [
                {
                    prop: 'nickName',
                    label: '国家',
                    width: 200,
                    fixed: true,
                },
                {
                    prop: 'nickName',
                    label: 'uid',
                },
                {
                    prop: 'nickName',
                    label: '昵称',
                },
                {
                    prop: 'url',
                    label: '头像',
                },
            ],  //表格
            total: 100,  //数据总量
            current_page: 1, //当前页
            current_limit:10, //每页条数

        };
    },

    mounted() {

    },

    methods: {
        /**
             * 翻页回调
             */
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
        },
    },
};
</script>

<style lang="stylus" scoped>

</style>