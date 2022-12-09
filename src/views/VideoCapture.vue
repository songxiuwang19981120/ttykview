<template>
    <!-- 搜索框 -->
    <div class="VideoCapture">

        <el-row type="flex">
            <el-col :span="8">
                <div style=" margin-left: 10px; ">
                    <el-input placeholder="请输入博主主页链接" v-model="input3" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search">获取TT视频</el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="8"></el-col>
            <el-col :span="8"></el-col>
        </el-row>
        <el-row type="flex">

            <el-col :span="8"> <el-button style="margin-left:10px; margin-top: 10px; margin-right: 10px;" type="primary"
                    size="mini" @click="open" round>导出下载地址</el-button><el-dropdown>
                    <el-button type="primary" size="mini">
                        视频状态<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>已下载</el-dropdown-item>
                        <el-dropdown-item>未下载</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown></el-col>
            <el-col :span="8"></el-col>
            <el-col :span="8"></el-col>
        </el-row>
        <!-- 表格 -->
        <table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
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
            border: true,
            input3: "",//搜索输入
            mutiSelect: true,
            loading: false,
            num: 0,
            tableData: [
                { ch: "中国", video: "", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "状态" },
                { ch: "中国", video: "", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "状态" },
                { ch: "中国", video: "", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "状态" },

            ],
            columns: [
                {
                    prop: 'ch',
                    label: '国家',

                },
                {
                    width: 100,
                    prop: 'video',
                    label: '视频',
                    render(h, { row }) {
                        return (
                            <div>
                                <img src="https://avatars.githubusercontent.com/u/115990494?s=48&v=4" height="60px" ></img>
                            </div>
                        )
                    }
                },
                {
                    prop: 'labela',
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
                    label: '评论量',
                    render(h, { row }) {
                        return (
                            <el-button type="primary" size="mini" >123</el-button>
                        )
                    }
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

        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //导出下载地址弹窗
        open() {
            this.$prompt('请输入下载地址', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '邮箱格式不正确'
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '你的下载地址为 ' + value
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消导出'
                });
            });
        }
    },
};
</script>

<style lang="stylus" scoped>

</style>