<template>
    <div>
        <div style="background-color:white; margin-bottom:10px; padding:10px">
            <el-button  type="primary" size="mini" @click="dialogVisible = true"><i class="el-icon-plus"></i>添加分组</el-button>
            <el-dialog
            title="添加分组"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-input v-model="input" placeholder="请输入分组名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
        </div>
        <div>
            <table-custom style="width:100%" :tableData="tableData" :columns="columns"></table-custom>
            <pagination :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination"></pagination>
        </div>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'EquipmentGroup',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            input:"",
            dialogVisible: false,
            tableData: [
            { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
                { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
                { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
            ],  //表格数据
            columns: [
                {
                    prop: 'labela',
                    label: '分组名称',
                    fiexd: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button type="primary" plain size="mini">{row.labela}</el-button>
                            </div>
                        );
                    },
                },
                {
                    prop: 'ch',
                    label: '账号数量',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'ch',
                    label: '操作',
                    fiexd: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <span style="color:#409EFF; margin-right:20px;margin-left:20px" onClick={this.examine.bind(this, row)}>编辑</span>
                                 <el-popconfirm
                                confirm-button-text='删除'
                                cancel-button-text='取消'
                                title="确认清除此设备中异常账号？"
                                onConfirm={this.messageBox.bind(this, row)}
                                >
                                    <el-button slot="reference" type="danger" size="mini">删除异常账号</el-button>
                                </el-popconfirm>
                                
                            </div>
                        );
                    },
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
        //编辑
        examine(){
            console.log(123)
        },
        //删除
        messageBox(){
            console.log(123)
        },
        //关闭
        handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
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