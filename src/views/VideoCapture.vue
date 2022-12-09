<template>
    <div>
        <table-custom :mutiSelect="mutiSelect" :loading="loading" :tableData="tableData" :columns="columns">
        </table-custom>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
export default {
    name: 'TtVideoCapture',
    components: {
        tableCustom
    },

    data() {
        return {
            mutiSelect:true,
            loading: false,
            tableData: [
                {ch:"中国",video:""},
                {nikeName:123,},

            ],
            columns: [
                {
                    prop: 'ch',
                    label: '国家',
                    width: 200,
                    fixed: true,
                },
                {
                    prop: 'video',
                    label: '视频',
                },
                {
                    prop: 'label',
                    label: '标签',
                },
                {
                    prop: 'userId',
                    label: '用户ID',
                },
                {
                    prop: 'videoId',
                    label: '视频ID',
                },
                {
                    prop: 'play',
                    label: '播放量',
                },
                {
                    prop: 'comment',
                    label: '评论量',
                },
                {
                    prop: 'like',
                    label: '点赞量',
                },
                {
                    prop: 'Time',
                    label: '抓取时间',
                },
                {
                    prop: 'tate',
                    label: '状态',
                },
               
            ],
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="stylus" scoped>

</style>