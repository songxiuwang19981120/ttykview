<template>
    <div>
        <table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
        <!-- <pagination :total="total" :current="current_page" @change="onPageChange"></pagination> -->
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
            loading: false,
            tableData: [],
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
                {
                    prop: 'nickName',
                    label: '签名',
                },
                {
                    prop: 'nickName',
                    label: '数据来源',
                },
                {
                    prop: 'nickName',
                    label: '数据标签',
                },
                {
                    prop: 'nickName',
                    label: '关注/粉丝/获赞',
                },
                {
                    prop: 'nickName',
                    label: '作品数量',
                },
                {
                    prop: 'nickName',
                    label: '采集时间',
                },
                {
                    prop: 'nickName',
                    label: '上次使用时间',
                }
            ],
            total: 100,
            current_page: 1

        };
    },

    mounted() {

    },

    methods: {
        /**
             * 翻页回调
             */
        onPageChange(page) {
            this.current_page = page;
        },
    },
};
</script>

<style lang="stylus" scoped>

</style>